import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkoutHistory.css';

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, week, month
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (userEmail) {
      fetchWorkoutData();
    } else {
      // Clear data when user is not logged in
      setWorkouts([]);
      setStats(null);
    }
  }, [userEmail, filter]);

  const fetchWorkoutData = async () => {
    try {
      setLoading(true);

      // Fetch workout statistics
      const statsResponse = await axios.get(`http://localhost:8081/api/workouts/${userEmail}/stats`);
      setStats(statsResponse.data);

      // Fetch workouts based on filter
      let workoutsResponse;
      if (filter === 'all') {
        workoutsResponse = await axios.get(`http://localhost:8081/api/workouts/${userEmail}`);
      } else {
        const endDate = new Date();
        const startDate = new Date();

        if (filter === 'week') {
          startDate.setDate(endDate.getDate() - 7);
        } else if (filter === 'month') {
          startDate.setMonth(endDate.getMonth() - 1);
        }

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        workoutsResponse = await axios.get(
          `http://localhost:8081/api/workouts/${userEmail}/week?start=${startDateStr}&end=${endDateStr}`
        );
      }

      // Sort workouts by date (newest first)
      const sortedWorkouts = workoutsResponse.data.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );
      setWorkouts(sortedWorkouts);

    } catch (error) {
      console.error('Error fetching workout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWorkoutTypeColor = (name) => {
    const colors = {
      'Running': '#FF6B6B',
      'Cycling': '#4ECDC4',
      'Swimming': '#45B7D1',
      'Weight Training': '#FFA07A',
      'Yoga': '#98D8C8',
      'Walking': '#F7DC6F',
      'default': '#A8E6CF'
    };
    return colors[name] || colors.default;
  };

  // If user is not logged in, show login prompt
  if (!userEmail) {
    return (
      <div className="workout-history-container">
        <div className="workout-history-card">
          <h1>Workout History</h1>
          <p>Please log in to view your workout history and statistics.</p>
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

  if (loading) {
    return (
      <div className="workout-history-container">
        <div className="loading">Loading workout history...</div>
      </div>
    );
  }

  return (
    <div className="workout-history-container">
      <div className="workout-history-card">
        <h1>Workout History</h1>

        {/* Statistics Section */}
        {stats && (
          <div className="stats-section">
            <h3>Your Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalWorkouts}</div>
                <div className="stat-label">Total Workouts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalCalories.toLocaleString()}</div>
                <div className="stat-label">Total Calories</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{Math.round(stats.totalDuration / 60)}h {stats.totalDuration % 60}m</div>
                <div className="stat-label">Total Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.daysActive}</div>
                <div className="stat-label">Active Days</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="filter-section">
          <h3>Filter Workouts</h3>
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All Time
            </button>
            <button
              className={filter === 'month' ? 'active' : ''}
              onClick={() => setFilter('month')}
            >
              Last Month
            </button>
            <button
              className={filter === 'week' ? 'active' : ''}
              onClick={() => setFilter('week')}
            >
              Last Week
            </button>
          </div>
        </div>

        {/* Workout List */}
        <div className="workout-list">
          <h3>Workout Log ({workouts.length} workouts)</h3>
          {workouts.length === 0 ? (
            <div className="no-workouts">
              <p>No workouts found for the selected period.</p>
              <p>Start logging your workouts to see your progress!</p>
            </div>
          ) : (
            <div className="workout-items">
              {workouts.map((workout, index) => (
                <div key={workout.id || index} className="workout-item">
                  <div
                    className="workout-type-indicator"
                    style={{ backgroundColor: getWorkoutTypeColor(workout.name) }}
                  ></div>
                  <div className="workout-details">
                    <div className="workout-header">
                      <h4>{workout.name}</h4>
                      <span className="workout-date">{formatDate(workout.date)}</span>
                    </div>
                    <div className="workout-metrics">
                      <span className="metric">
                        <i className="fas fa-clock"></i> {workout.duration} min
                      </span>
                      <span className="metric">
                        <i className="fas fa-fire"></i> {workout.calories} cal
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutHistory;