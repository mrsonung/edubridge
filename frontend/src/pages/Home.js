import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './home.css';
import Header from '../components/Header';

const Home = () => {
  const [teachers, setTeachers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');
  const menuRef = useRef();

  useEffect(() => {
    fetch('http://localhost:5000/auth/teachers')
      .then(res => res.json())
      .then(data => setTeachers(data))
      .catch(console.error);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    
    <div className="home">
<Header />
      <section className="hero" id="home">

  {/* LEFT SIDE */}
  <div className="hero-left">
    <h1>
      Learn Better with <span>EduBridge</span>
    </h1>

    <p>
      Connecting students with expert teachers for personalized learning,
      real growth, and better academic results.
    </p>

    <div className="hero-actions">
      <button
        className="hero-btn primary"
        onClick={() => navigate('/teachers')}
      >
        Book Your Teacher
      </button>

      <button
        className="hero-btn secondary"
        onClick={() => navigate('/about')}
      >
        Learn More
      </button>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="hero-right">
    <img src="/hero.png" alt="learning" />
  </div>

</section>

     {/* FEATURES */}
<section className="features">
  <h2>Why Choose EduBridge?</h2>

  <div className="features-grid">
    <div className="feature-card">
      <h3>🎓 Qualified Tutors</h3>
      <p>Learn from verified and experienced teachers across subjects.</p>
    </div>

    <div className="feature-card">
      <h3>⏰ Flexible Scheduling</h3>
      <p>Book classes at your convenience anytime, anywhere.</p>
    </div>

    <div className="feature-card">
      <h3>📚 Personalized Learning</h3>
      <p>Customized lessons based on your learning style and goals.</p>
    </div>

    <div className="feature-card">
      <h3>💻 Online & Offline Support</h3>
      <p>Choose between home tutoring or online sessions.</p>
    </div>

    <div className="feature-card">
      <h3>💳 Secure Payments</h3>
      <p>Safe, encrypted, and transparent payment system.</p>
    </div>

    <div className="feature-card">
      <h3>⭐ Verified Reviews</h3>
      <p>Check ratings and reviews before choosing a tutor.</p>
    </div>

    <div className="feature-card">
      <h3>📍 Nearby Tutors</h3>
      <p>Find trusted tutors available near your location.</p>
    </div>

    <div className="feature-card">
      <h3>🚀 Fast Booking</h3>
      <p>Book a tutor in just a few clicks without hassle.</p>
    </div>
  </div>
</section>

      {/* TEACHERS */}
      <section className="teachers" id="teachers">
        <h2>Meet Our Teachers</h2>

        <div className="teacher-grid">
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="teacher-card"
              onClick={() => navigate(`/teacher/${teacher._id}`)}
            >
              <img src={teacher.profilePic} alt={teacher.name} />
              <h3>{teacher.name}</h3>
              <p>{teacher.qualification}</p>
              <span>{teacher.subjects}</span>
            <button className='btn'>{teacher.book}Book your Slot</button>
            </div>
          ))}
        </div>
        
      </section>
<section className="about" id="about">
  <h2>About EduBridge</h2>
  <p>
    EduBridge is a platform that connects students with qualified teachers
    for personalized and effective learning experiences. Our mission is to
    make education accessible, flexible, and impactful for everyone.
  </p>
</section>
      <Footer />
    </div>
  );
};

export default Home;