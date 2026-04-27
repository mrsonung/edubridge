import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem("role");

  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setMobileNav(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getDashboardRoute = () => {
    if (role === "teacher") return "/dashboard-teacher";
    if (role === "student") return "/dashboard-student";
    return "/login";
  };

  return (
    <header className="header" ref={menuRef}>

      <Link to="/" className="logo-wrapper">
        <img src={`${process.env.PUBLIC_URL}/edubridge-logo.png`} alt="logo" />
        <h2>Edu<span>Bridge</span></h2>
      </Link>

      <nav className={`nav-links ${mobileNav ? "active" : ""}`}>
        <a onClick={() => {
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  }}>Home</a>
        <a
  onClick={() => {
    document.getElementById("teachers")?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  }}
>
  Teachers
</a>

<a
  onClick={() => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  }}
>
  About
</a>
      </nav>

      <div className="nav-right">
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
                <Link to={getDashboardRoute()}>Dashboard</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div 
  className={`hamburger ${mobileNav ? "active" : ""}`} 
  onClick={() => setMobileNav(!mobileNav)}
>
  <span></span>
  <span></span>
  <span></span>
</div>

    </header>
  );
};

export default Header;