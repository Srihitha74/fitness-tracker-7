package com.example.fitness.controller;

import com.example.fitness.model.WorkoutLog;
import com.example.fitness.repository.WorkoutLogRepository;
import com.example.fitness.model.User;
import com.example.fitness.repository.UserRepository;
import com.example.fitness.model.WorkoutStats;
import com.example.fitness.model.DailyWorkoutData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutLogController {

    @Autowired
    private WorkoutLogRepository workoutLogRepo;

    @Autowired
    private UserRepository userRepo;

    // Save workout log for a user
    @PostMapping("/{email}")
    public WorkoutLog saveWorkout(@PathVariable String email, @RequestBody WorkoutLog log) {
        User user = userRepo.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found with email: " + email);
        log.setUser(user);

        // Set the date for the workout, either to the provided date or the current date
        if (log.getDate() == null) {
            log.setDate(LocalDate.now());  // Set current date if no date is provided
        }

        return workoutLogRepo.save(log);
    }

    // Get all workouts for a specific user
    @GetMapping("/{email}")
    public List<WorkoutLog> getUserWorkouts(@PathVariable String email) {
        List<WorkoutLog> workoutLogs = workoutLogRepo.findByUserEmail(email);
        workoutLogs.forEach(workoutLog -> workoutLog.setUser(null));  // Remove user object from the logs to avoid recursion
        return workoutLogs;
    }

    // Get workouts for a user within a specific week (date range)
    @GetMapping("/{email}/week")
    public List<WorkoutLog> getWeeklyWorkouts(@PathVariable String email,
                                               @RequestParam("start") String startDateStr,
                                               @RequestParam("end") String endDateStr) {
        LocalDate startDate = LocalDate.parse(startDateStr);
        LocalDate endDate = LocalDate.parse(endDateStr);

        List<WorkoutLog> weeklyWorkouts = workoutLogRepo.findByUserAndDateBetween(
            userRepo.findByEmail(email), startDate, endDate);

        weeklyWorkouts.forEach(workoutLog -> workoutLog.setUser(null));  // Remove user object from logs
        return weeklyWorkouts;
    }

    // Get workout statistics for a user
    @GetMapping("/{email}/stats")
    public WorkoutStats getWorkoutStats(@PathVariable String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found with email: " + email);

        List<WorkoutLog> allWorkouts = workoutLogRepo.findByUserEmail(email);

        WorkoutStats stats = new WorkoutStats();
        stats.setTotalWorkouts(allWorkouts.size());
        stats.setTotalCalories(allWorkouts.stream().mapToInt(WorkoutLog::getCalories).sum());
        stats.setTotalDuration(allWorkouts.stream().mapToInt(WorkoutLog::getDuration).sum());

        if (!allWorkouts.isEmpty()) {
            LocalDate earliestDate = allWorkouts.stream()
                .map(WorkoutLog::getDate)
                .min(LocalDate::compareTo)
                .orElse(LocalDate.now());
            stats.setDaysActive((int) java.time.temporal.ChronoUnit.DAYS.between(earliestDate, LocalDate.now()) + 1);
        }

        return stats;
    }

    // Get workouts grouped by date for chart display
    @GetMapping("/{email}/chart-data")
    public List<DailyWorkoutData> getChartData(@PathVariable String email,
                                              @RequestParam(value = "days", defaultValue = "30") int days) {
        User user = userRepo.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found with email: " + email);

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);

        List<WorkoutLog> workouts = workoutLogRepo.findByUserAndDateBetween(user, startDate, endDate);

        // Group workouts by date
        Map<LocalDate, DailyWorkoutData> dailyData = new java.util.HashMap<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            dailyData.put(date, new DailyWorkoutData(date, 0, 0));
        }

        for (WorkoutLog workout : workouts) {
            DailyWorkoutData data = dailyData.get(workout.getDate());
            if (data != null) {
                data.setCalories(data.getCalories() + workout.getCalories());
                data.setDuration(data.getDuration() + workout.getDuration());
            }
        }

        return new java.util.ArrayList<>(dailyData.values());
    }
}
