import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./WeeklyProgressChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyProgressChart = ({ workoutLogs, title = "Weekly Progress Overview", days = 7 }) => {
  // Initialize an array to store data for the specified number of days
  const dailyData = Array.from({ length: days }, () => ({ calories: 0, duration: 0 }));

  // Process workout logs to calculate daily data
  workoutLogs.forEach((workout) => {
    const workoutDate = new Date(workout.date);
    const today = new Date();

    // Calculate days difference
    const daysDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 0 && daysDiff < days) {
      const calories = parseFloat(workout.calories) || 0;
      const duration = parseFloat(workout.duration) || 0;
      dailyData[days - 1 - daysDiff].calories += calories;
      dailyData[days - 1 - daysDiff].duration += duration;
    }
  });

  // Extract calories for chart
  const dailyCalories = dailyData.map(day => day.calories);

  // Calculate statistics for the chart
  const totalCalories = dailyCalories.reduce((sum, calories) => sum + calories, 0);
  const averageCalories = days > 0 ? totalCalories / days : 0;
  const maxCalories = Math.max(...dailyCalories);
  const totalDuration = dailyData.reduce((sum, day) => sum + day.duration, 0);
  const averageDuration = days > 0 ? totalDuration / days : 0;

  // Generate labels based on days
  const generateLabels = () => {
    const labels = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      if (days <= 7) {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      } else {
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }
    return labels;
  };

  const chartLabels = generateLabels();

  // Enhanced chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Calories Burned',
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Days of the Week',
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(30, 30, 40, 0.9)',
        titleColor: '#a29bfe',
        bodyColor: '#ffffff',
        borderColor: 'rgba(108, 92, 231, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} calories`;
          }
        }
      }
    }
  };

  // Prepare the chart data with gradient fills
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Calories Burned",
        data: dailyCalories,
        backgroundColor: dailyCalories.map((value, index) => {
          // Create gradient colors
          const intensity = Math.min(value / Math.max(...dailyCalories) * 100, 100);
          const hue = 200 + (intensity * 0.6); // Blue to cyan gradient
          return `hsla(${hue}, 70%, 65%, 0.8)`;
        }),
        borderColor: dailyCalories.map((value, index) => {
          const intensity = Math.min(value / Math.max(...dailyCalories) * 100, 100);
          const hue = 200 + (intensity * 0.6);
          return `hsla(${hue}, 80%, 60%, 1)`;
        }),
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: dailyCalories.map((value, index) => {
          const intensity = Math.min(value / Math.max(...dailyCalories) * 100, 100);
          const hue = 200 + (intensity * 0.6);
          return `hsla(${hue}, 80%, 70%, 1)`;
        }),
      },
    ],
  };

  return (
    <div className="weekly-progress-chart">
      <h3>{title}</h3>
      
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      <div className="chart-stats">
        <div className="stat-item">
          <div className="stat-value">{totalCalories.toLocaleString()}</div>
          <div className="stat-label">Total Calories</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{Math.round(averageCalories)}</div>
          <div className="stat-label">Daily Average</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{Math.round(totalDuration)}m</div>
          <div className="stat-label">Total Time</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{maxCalories}</div>
          <div className="stat-label">Peak Calories</div>
        </div>
      </div>
      
      <div className="chart-legend">
        {chartData.labels.map((label, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{backgroundColor: chartData.datasets[0].backgroundColor[index]}}
            ></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgressChart;