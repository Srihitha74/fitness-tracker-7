import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');

    // Reset login state
    setIsLoggedIn(false);

    // Navigate to home page
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <p className="logo">🏋️‍♀️FIT PULSE</p>
      </Link>
      <div className="nav-buttons">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button className="nav-btn">Login</button>
            </Link>
            <Link to="/register">
              <button className="nav-btn">Register</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">
              <button className="nav-btn">Dashboard</button>
            </Link>
            <Link to="/history">
              <button className="nav-btn">History</button>
            </Link>
            <Link to="/profile">
              <button className="nav-btn">Profile</button>
            </Link>
            <button className="nav-btn logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
