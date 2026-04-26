import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem("role"); // ✅ reliable

  const navigate = useNavigate();
  const menuRef = useRef();

  // ✅ close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ logout clean
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // ✅ no reload
  };

  // ✅ dashboard route fix
  const getDashboardRoute = () => {
    if (role === "teacher") return "/dashboard-teacher";
    if (role === "student") return "/dashboard-student";
    return "/login"; // fallback
  };

  return (
    <header className="header">

      {/* LOGO */}
      <Link to="/" className="logo-wrapper">
        <img
          src={`${process.env.PUBLIC_URL}/edubridge-logo.png`}
          alt="EduBridge"
          className="logo-img"
        />
        <h2 className="logo-text">
          Edu<span>Bridge</span>
        </h2>
      </Link>

      {/* NAV LINKS */}
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#teachers">Teachers</a>
        <a href="#about">About</a>
      </nav>

      {/* RIGHT SIDE */}
      <div className="nav-right" ref={menuRef}>
        {!user ? (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register-student" className="signup-btn">Sign Up</Link>
          </>
        ) : (
          <div className="profile-box">
            <img
              src={user.profilePic || `${process.env.PUBLIC_URL}/default_profile.png`}
              alt="profile"
              className="profile-img"
              onClick={() => setMenuOpen(!menuOpen)}
            />

            {menuOpen && (
              <div className="dropdown">
                <Link to={getDashboardRoute()}>
                  Dashboard
                </Link>

                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </header>
  );
};

export default Header;