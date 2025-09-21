import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import CalorieCalculator from "./CalorieCalculator";
import StepsCalculator from "./StepsCalculator";
import WorkoutLogger from "./WorkoutLogger";
import WeeklyProgressChart from "./WeeklyProgressChart";
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("chart");
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [chartPeriod, setChartPeriod] = useState(7); // 7 days, 30 days, etc.
  const userEmail = localStorage.getItem("userEmail");

  const fetchWorkoutLogs = async () => {
    try {
      const response = await axios.get(
        `/api/workouts/${userEmail}`
      );
      setWorkoutLogs(response.data);
    } catch (error) {
      console.error("Error fetching workout logs:", error);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchWorkoutLogs();
    } else {
      // Clear workout data when user is not logged in
      setWorkoutLogs([]);
    }
  }, [userEmail]);

  const handleAddWorkout = async (workout) => {
    try {
      const response = await axios.post(
        `/api/workouts/${userEmail}`,
        {
          ...workout,
          duration: parseInt(workout.duration),
          calories: parseInt(workout.calories),
          date: workout.date,
        }
      );
      fetchWorkoutLogs();
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  // If user is not logged in, show login prompt
  if (!userEmail) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1>Welcome to Fitness Tracker</h1>
          <p>Please log in to view your dashboard and track your workouts.</p>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="/login" style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              Login to Continue
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome Back, Champion – Your Progress Starts Here!</h1>
        <p>
          From reps to results, Fitness Tracker keeps you aligned and
          accountable
        </p>

        <div className="dashboard-tab-buttons">
          <button
            onClick={() => setActiveTab("chart")}
            className={activeTab === "chart" ? "active" : ""}
          >
            Progress Chart
          </button>
          <button
            onClick={() => setActiveTab("logger")}
            className={activeTab === "logger" ? "active" : ""}
          >
            Workout Logger
          </button>
          <button
            onClick={() => setActiveTab("calories")}
            className={activeTab === "calories" ? "active" : ""}
          >
            Calorie Calculator
          </button>
          <button
            onClick={() => setActiveTab("steps")}
            className={activeTab === "steps" ? "active" : ""}
          >
            Steps Calculator
          </button>
        </div>

        <div className="dashboard-widget">
          {activeTab === "chart" && (
            <>
              <div className="chart-controls">
                <h3>Progress Chart</h3>
                <div className="period-buttons">
                  <button
                    className={chartPeriod === 7 ? 'active' : ''}
                    onClick={() => setChartPeriod(7)}
                  >
                    7 Days
                  </button>
                  <button
                    className={chartPeriod === 30 ? 'active' : ''}
                    onClick={() => setChartPeriod(30)}
                  >
                    30 Days
                  </button>
                  <button
                    className={chartPeriod === 90 ? 'active' : ''}
                    onClick={() => setChartPeriod(90)}
                  >
                    90 Days
                  </button>
                </div>
              </div>
              <WeeklyProgressChart
                workoutLogs={workoutLogs}
                title={`${chartPeriod} Day Progress Overview`}
                days={chartPeriod}
              />
            </>
          )}
          {activeTab === "logger" && (
            <>
              <h3>Store Your Workout</h3>
              <WorkoutLogger onAddWorkout={handleAddWorkout} />
            </>
          )}
          {activeTab === "calories" && <CalorieCalculator />}
          {activeTab === "steps" && <StepsCalculator />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
