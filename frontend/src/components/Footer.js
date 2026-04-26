import React from 'react';
import { Link } from "react-router-dom";
const Footer = () => (
  <footer className="footer">
    <div className="footer-grid">
      {/* About section */}
      <div>
        <h4>About</h4>
        <ul>
          <li><a href="/">Who are we?</a></li>
          <li><a href="/">Terms & Conditions</a></li>
          <li><a href="/">Privacy Policy</a></li>
          <li><a href="/">Meet our Teachers</a></li>
          <li><a href="/">Online Classes</a></li>
        </ul>
      </div>
      {/* Subjects section */}
      <div>
        <h4>Subjects</h4>
        <ul>
          <li><a href="/">Maths</a></li>
          <li><a href="/">Computer Sciences</a></li>
          <li><a href="/">Languages</a></li>
          <li><a href="/">Health & Well-being</a></li>
          <li><a href="/">Music & Arts</a></li>
        </ul>
      </div>
      {/* Community/adventure section */}
      <div>
        <h4>Community</h4>
        <ul>
          <li><a href="/">EduBridge Blog</a></li>
        </ul>
      </div>
      {/* Help section */}
      <div>
        <h4>Help</h4>
        <ul>
          <li><a href="/">Contact</a></li>
          <li><a href="/">Support</a></li>
        </ul>
      </div>
      {/* Social section */}
      <div>
        <h4>Follow us</h4>
        <div className="footer-social">
          <a href="/"><i className="fa-brands fa-facebook-f"></i></a>
<a href="/"><i className="fa-brands fa-instagram"></i></a>
<a href="/"><i className="fa-brands fa-linkedin-in"></i></a>
        </div>
      </div>
    </div>
    
    <div className="footer-bottom">
      © 2025 EduBridge. Learn with the best! By Nigam Sahab
    </div>
  </footer>
);

export default Footer;
