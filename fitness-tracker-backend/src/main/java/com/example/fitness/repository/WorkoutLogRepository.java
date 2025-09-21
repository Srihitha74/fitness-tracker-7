package com.example.fitness.repository;

import com.example.fitness.model.WorkoutLog;
import com.example.fitness.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    
    // Fetch workouts by user email
    List<WorkoutLog> findByUserEmail(String email);

    // Fetch workouts by user and within a date range
    List<WorkoutLog> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
