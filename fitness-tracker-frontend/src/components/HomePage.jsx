import React from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="welcome-box">
        <h1>Smarter Health Decisions Start Here

</h1>
        <p className="welcome-desc">
          Access real-time data and expert-backed insights to support your wellbeing
        </p>
        <Link to="/dashboard" className="cta-button">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;