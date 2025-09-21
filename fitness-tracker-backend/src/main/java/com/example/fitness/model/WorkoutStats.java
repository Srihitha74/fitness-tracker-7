package com.example.fitness.model;

public class WorkoutStats {
    private int totalWorkouts;
    private int totalCalories;
    private int totalDuration;
    private int daysActive;

    public WorkoutStats() {}

    public WorkoutStats(int totalWorkouts, int totalCalories, int totalDuration, int daysActive) {
        this.totalWorkouts = totalWorkouts;
        this.totalCalories = totalCalories;
        this.totalDuration = totalDuration;
        this.daysActive = daysActive;
    }

    // Getters and Setters
    public int getTotalWorkouts() { return totalWorkouts; }
    public void setTotalWorkouts(int totalWorkouts) { this.totalWorkouts = totalWorkouts; }

    public int getTotalCalories() { return totalCalories; }
    public void setTotalCalories(int totalCalories) { this.totalCalories = totalCalories; }

    public int getTotalDuration() { return totalDuration; }
    public void setTotalDuration(int totalDuration) { this.totalDuration = totalDuration; }

    public int getDaysActive() { return daysActive; }
    public void setDaysActive(int daysActive) { this.daysActive = daysActive; }
}