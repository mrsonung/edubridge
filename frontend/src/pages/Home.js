import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './home.css';
import Header from '../components/Header';

const Home = () => {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/teachers`)
      .then(res => res.json())
      .then(data => setTeachers(data))
      .catch(console.error);
  }, []);

  return (
    <div className="home">
      <Header />

      {/* HERO */}
      <section className="hero" id="home">
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
  onClick={() => {
    document.getElementById("teachers")?.scrollIntoView({ behavior: "smooth" });
  }}
>
  Book Your Teacher
</button>

<button
  className="hero-btn secondary"
  onClick={() => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }}
>
  Learn More
</button>
          </div>
        </div>

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
              <button className="btn">Book your Slot</button>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
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