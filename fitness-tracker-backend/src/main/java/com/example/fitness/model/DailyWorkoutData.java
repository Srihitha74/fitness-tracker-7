package com.example.fitness.model;

import java.time.LocalDate;

public class DailyWorkoutData {
    private LocalDate date;
    private int calories;
    private int duration;

    public DailyWorkoutData() {}

    public DailyWorkoutData(LocalDate date, int calories, int duration) {
        this.date = date;
        this.calories = calories;
        this.duration = duration;
    }

    // Getters and Setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}