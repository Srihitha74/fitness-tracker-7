import React, { useState, useRef, useEffect } from "react";
import "./WorkoutLogger.css";

const WorkoutLogger = ({ onAddWorkout }) => {
  const [workout, setWorkout] = useState({
    name: "",
    duration: "",
    calories: "",
    date: "", // Date field for workout
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Comprehensive list of exercises organized by categories
  const exerciseCategories = {
    "Cardio": [
      "Running", "Jogging", "Cycling", "Swimming", "Rowing", "Elliptical",
      "Treadmill", "Stair Climber", "Jump Rope", "Burpees", "Mountain Climbers",
      "High Knees", "Butt Kicks", "Sprint Intervals", "HIIT Workout"
    ],
    "Strength Training": [
      "Push-ups", "Pull-ups", "Squats", "Deadlifts", "Bench Press", "Overhead Press",
      "Bicep Curls", "Tricep Extensions", "Shoulder Raises", "Lateral Raises",
      "Chest Flyes", "Lat Pulldowns", "Rows", "Dips", "Planks", "Russian Twists",
      "Lunges", "Step-ups", "Calf Raises", "Leg Press", "Leg Curls", "Leg Extensions"
    ],
    "Yoga & Flexibility": [
      "Yoga Flow", "Pilates", "Stretching", "Meditation", "Tai Chi",
      "Downward Dog", "Warrior Pose", "Tree Pose", "Child's Pose"
    ],
    "Sports & Activities": [
      "Basketball", "Soccer", "Tennis", "Volleyball", "Baseball", "Golf",
      "Hiking", "Rock Climbing", "Martial Arts", "Boxing", "Kickboxing",
      "Dancing", "Aerobics", "Zumba", "CrossFit", "Functional Training"
    ],
    "Home Workouts": [
      "Bodyweight Exercises", "Resistance Band Training", "Dumbbell Workout",
      "Kettlebell Workout", "Wall Sit", "Superman", "Bridge", "Bicycle Crunches",
      "Leg Raises", "Flutter Kicks", "Jumping Jacks", "Arm Circles"
    ]
  };

  // Flatten all exercises for easier searching
  const allExercises = Object.values(exerciseCategories).flat();

  // Filter exercises based on input and include category info
  const filterExercises = (input) => {
    if (!input.trim()) {
      // Show popular exercises from different categories when no input
      const popularExercises = [
        "Running", "Push-ups", "Squats", "Cycling", "Swimming",
        "Yoga Flow", "Basketball", "Bodyweight Exercises", "HIIT Workout"
      ];
      return popularExercises.slice(0, 10);
    }

    const filtered = [];
    const inputLower = input.toLowerCase();

    // Search through all categories
    Object.entries(exerciseCategories).forEach(([category, exercises]) => {
      exercises.forEach(exercise => {
        if (exercise.toLowerCase().includes(inputLower)) {
          filtered.push({
            name: exercise,
            category: category
          });
        }
      });
    });

    return filtered.slice(0, 10); // Limit to 10 results
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkout((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'name') {
      if (value.trim()) {
        setFilteredExercises(filterExercises(value));
        setShowDropdown(true);
        setSelectedIndex(-1);
      } else {
        setShowDropdown(false);
      }
    }
  };

  const handleInputFocus = () => {
    // Always show dropdown on focus, with popular exercises if input is empty
    const exercises = filterExercises(workout.name);
    setFilteredExercises(exercises);
    setShowDropdown(true);
    console.log('Dropdown triggered with exercises:', exercises);
  };

  const handleExerciseSelect = (exercise) => {
    const exerciseName = typeof exercise === 'string' ? exercise : exercise.name;
    setWorkout((prev) => ({
      ...prev,
      name: exerciseName,
    }));
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredExercises.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredExercises[selectedIndex]) {
          handleExerciseSelect(filteredExercises[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Temporary: Force show dropdown on component mount for testing
  useEffect(() => {
    const exercises = filterExercises('');
    setFilteredExercises(exercises);
    setShowDropdown(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (workout.name && workout.duration && workout.calories && workout.date) {
      onAddWorkout(workout); // Pass the workout to parent component
      setWorkout({ name: "", duration: "", calories: "", date: "" }); // Reset form
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="workout-logger">
      <h3>Enter Workout Details</h3>
      <form onSubmit={handleSubmit} className="workout-form">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div style={{ flex: "1" }}>
            <label>Workout Name:</label>
            <div className="exercise-input-container" ref={dropdownRef} onClick={() => {
              if (!showDropdown) {
                handleInputFocus();
              }
            }}>
              <input
                ref={inputRef}
                type="text"
                name="name"
                value={workout.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                placeholder="Type or select exercise..."
                required
                autoComplete="off"
                style={{ width: "95%", maxWidth: "200px" }}
              />
              {showDropdown && filteredExercises.length > 0 && (
                <div className="exercise-dropdown" style={{border: '2px solid red'}}>
                  {filteredExercises.map((exercise, index) => {
                    const exerciseName = typeof exercise === 'string' ? exercise : exercise.name;
                    const category = typeof exercise === 'string' ? 'Exercise' : exercise.category;

                    return (
                      <div
                        key={exerciseName}
                        className={`exercise-option ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => handleExerciseSelect(exercise)}
                      >
                        <div className="exercise-name">{exerciseName}</div>
                        <div className="exercise-category">{category}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="exercise-hint">
                Choose from dropdown or type your own exercise
              </div>
            </div>
          </div>

          <div style={{ flex: "1" }}>
            <label>Duration (in minutes):</label>
            <input
              type="number"
              name="duration"
              value={workout.duration}
              onChange={handleInputChange}
              placeholder="e.g. 30"
              required
              style={{ width: "95%", maxWidth: "200px" }} // Smaller size
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <div style={{ flex: "1" }}>
            <label>Calories Burned:</label>
            <input
              type="number"
              name="calories"
              value={workout.calories}
              onChange={handleInputChange}
              placeholder="e.g. 300"
              required
              style={{ width: "95%", maxWidth: "200px" }} // Smaller size
            />
          </div>

          <div style={{ flex: "1" }}>
            <label>Date of Workout:</label>
            <input
              type="date"
              name="date"
              value={workout.date}
              onChange={handleInputChange}
              required
              style={{ width: "95%", maxWidth: "200px" }} // Smaller size
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4bc0c0",
            color: "white",
            fontSize: "16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "15px",
          }}
        >
          Log Workout
        </button>
      </form>
    </div>
  );
};

export default WorkoutLogger;
