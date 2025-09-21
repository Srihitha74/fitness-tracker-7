import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    fitnessGoal: '',
    activityLevel: ''
  });
  const userEmail = localStorage.getItem('userEmail');

  console.log('Profile component rendered, userEmail:', userEmail);
  console.log('localStorage contents:', {
    userEmail: localStorage.getItem('userEmail'),
    isLoggedIn: localStorage.getItem('isLoggedIn')
  });

  const fetchUser = async () => {
    if (!userEmail) {
      console.log('No user email found in localStorage');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user data for:', userEmail);
      setLoading(true);
      const response = await axios.get(`/api/users/${userEmail}`);
      console.log('User data received:', response.data);
      console.log('Email from response:', response.data.email);
      console.log('Email from localStorage:', userEmail);

      // Ensure email is properly set in the user object
      const userData = {
        ...response.data,
        email: response.data.email || userEmail // Fallback to localStorage email
      };

      setUser(userData);
      setFormData({
        name: userData.name || '',
        age: userData.age || '',
        height: userData.height || '',
        weight: userData.weight || '',
        gender: userData.gender || '',
        fitnessGoal: userData.fitnessGoal || '',
        activityLevel: userData.activityLevel || ''
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Profile component mounted/updated, userEmail:', userEmail);
    fetchUser();
  }, [userEmail]);

  // Add visibility change listener to refetch data when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userEmail) {
        console.log('Tab became visible, refetching profile data');
        fetchUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [userEmail]);

  // Add focus listener to refetch data when user returns to profile page
  useEffect(() => {
    const handleFocus = () => {
      if (userEmail) {
        console.log('Window focused, refetching profile data');
        fetchUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [userEmail]);

  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        ...formData,
        email: userEmail, // Ensure email is included
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null
      };
      console.log('Sending updated user data:', updatedUser);
      const response = await axios.put(`/api/users/${userEmail}`, updatedUser);
      console.log('Update response:', response.data);
      console.log('Update response status:', response.status);

      // Use the response from backend to update local state
      const updatedUserFromBackend = response.data;
      console.log('Updated user from backend:', updatedUserFromBackend);
      console.log('Email in response:', updatedUserFromBackend.email);
      setUser(updatedUserFromBackend);
      setFormData({
        name: updatedUserFromBackend.name || '',
        age: updatedUserFromBackend.age || '',
        height: updatedUserFromBackend.height || '',
        weight: updatedUserFromBackend.weight || '',
        gender: updatedUserFromBackend.gender || '',
        fitnessGoal: updatedUserFromBackend.fitnessGoal || '',
        activityLevel: updatedUserFromBackend.activityLevel || ''
      });

      setEditing(false);
      setMessage('Profile updated successfully!');

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('Error details:', error.response?.data || error.message);
      setMessage('Failed to update profile. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // If user is not logged in, show login prompt
  if (!userEmail) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h1>User Profile</h1>
          <p>Please log in to view and edit your profile.</p>
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
      <div className="profile-container">
        <div className="profile-card">
          <h1>User Profile</h1>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '3px solid var(--accent)',
              borderRadius: '50%',
              borderTopColor: 'transparent',
              animation: 'spin 1s ease-in-out infinite',
              marginBottom: '1rem'
            }}></div>
            <p>Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="profile-container">User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>User Profile</h1>
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        <div className="profile-info">
          <div className="profile-field">
            <label>Name:</label>
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            ) : (
              <span>{user.name || 'Not set'}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email || userEmail}</span>
          </div>
          <div className="profile-field">
            <label>Age:</label>
            {editing ? (
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter your age"
              />
            ) : (
              <span>{user.age ? `${user.age} years` : 'Not set'}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Height:</label>
            {editing ? (
              <input
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="Height in cm"
              />
            ) : (
              <span>{user.height ? `${user.height} cm` : 'Not set'}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Weight:</label>
            {editing ? (
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="Weight in kg"
              />
            ) : (
              <span>{user.weight ? `${user.weight} kg` : 'Not set'}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Gender:</label>
            {editing ? (
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span>{user.gender || 'Not set'}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Fitness Goal:</label>
            {editing ? (
              <select
                value={formData.fitnessGoal}
                onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}
              >
                <option value="">Select goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Improve Fitness">Improve Fitness</option>
                <option value="Sports Performance">Sports Performance</option>
              </select>
            ) : (
              <span>{user.fitnessGoal || 'Not set'}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Activity Level:</label>
            {editing ? (
              <select
                value={formData.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              >
                <option value="">Select activity level</option>
                <option value="Sedentary">Sedentary (little/no exercise)</option>
                <option value="Lightly Active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="Moderately Active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="Very Active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="Extremely Active">Extremely Active (very hard exercise & physical job)</option>
              </select>
            ) : (
              <span>{user.activityLevel || 'Not set'}</span>
            )}
          </div>
        </div>
        <div className="profile-actions">
          {editing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)}>Edit Profile</button>
              <button
                onClick={fetchUser}
                style={{
                  background: 'rgba(42, 43, 61, 0.7)',
                  marginLeft: '1rem'
                }}
              >
                Refresh Data
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;