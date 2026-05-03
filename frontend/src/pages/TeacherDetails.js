
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './TeacherDetails.css';

const dummyTeachers = [
  {
    id: '1',
    name: 'Manisha',
    image: 'https://via.placeholder.com/280',
    location: 'Online',
    ambassador: true,
    bio: `I am a passionate Yoga Teacher and therapist with over 8 years of experience! Join my uplifting online classes to transform your life.
    With a certification in Yoga Therapy from Bangalore and a Master’s in Yogic Science from Rishikesh, I empower you to embrace your true potential.`,
    classDetails: {
      level: 'All Levels',
      languages: ['English', 'Hindi'],
      summary: `Yoga is a journey that harmonizes your body, mind, and soul! I’m passionate about promoting health awareness and helping others embrace their well-being. 
      Imagine achieving the ultimate milestone—being healthy! Just an hour each day can unlock a vibrant, youthful you.`,
    },
    reviews: [
      {
        id: 'r1',
        user: 'Jissmon',
        rating: 5,
        comment: `Perfect! I recently attended my first yoga session with Manisha Ma'am. The session was both intense and effective, with a strong focus on overall well-being.
        Manisha Ma'am guided me through challenging poses while ensuring I felt comfortable and supported throughout. The balance between intensity and relaxation was perfect.
        Her clear instructions made it easy to follow along and stay engaged. Overall, it was an outstanding session that left me eager for the next one. I highly recommend Manisha Ma'am.`,
      },
      {
        id: 'r2',
        user: 'Prankur',
        rating: 5,
        comment: `Perfect! I cannot recommend Manisha highly enough! Her classes are an absolute delight, blending expert guidance with a warm and inviting atmosphere.
        Her deep understanding of yoga philosophy and anatomy shines through in each session, making every pose feel purposeful and empowering.
        I've noticed a significant improvement in my flexibility, strength, and overall well-being since I started attending her classes.
        Beyond the physical benefits, she also cultivates a sense of mindfulness and inner peace that stays with me long after the class ends.`,
        teacherResponse: `Prankur is a disciplined yoga practitioner, very calm and obedient.
        He needs time to open his body and develop a deeper understanding and should continue practice for a long time.`,
      },
      {
        id: 'r3',
        user: 'Swetha',
        rating: 5,
        comment: `Manisha's generosity of spirit and abundant patience and talent as a teacher comes across strongly in her lessons,
        which are tailored to the individual and moment and taught sincerely. Lessons have been the highlight of my days.`,
      }
    ],
    recommendations: [
      'Krishay: Manisha ji is an excellent Yoga teacher. She is a very kind soul and skilled.',
      'Shivang: Manisha is AMAZING! Works well with all levels, very punctual and fun to work with.',
      'Krishay ji: Highly recommended—very kind and talented.'
    ],
    rates: {
      single: 2500,
      pack5h: 12500,
      pack10h: 25000,
      online: 2000,
      freeTrial: '30 mins'
    }
  },
  // Add more teachers here if needed
];

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const found = dummyTeachers.find(t => t.id === id);
    if (!found) {
      navigate('/');
      return;
    }
    setTeacher(found);
    const timer = setTimeout(() => setFadeIn(true), 150);
    return () => clearTimeout(timer);
  }, [id, navigate]);

  if (!teacher) return null;

  return (
    <div className={`teacher-details-container${fadeIn ? ' fade-in' : ''}`}>
      <Link to="/" className="back-link">← Back to Teachers</Link>
      <div className="teacher-header">
        <img src={teacher.image} alt={teacher.name} className="teacher-photo-large" />
        <div className="teacher-main-info">
          <h1>{teacher.name}</h1>
          {teacher.ambassador && <div className="ambassador-badge">Ambassador</div>}
          <div className="class-location">Class location: <a href="https://www.superprof.co.in/lessons/yoga/online/" target="_blank" rel="noopener noreferrer">{teacher.location}</a></div>
          <p className="teacher-bio">{teacher.bio}</p>

          <section className="class-details-section">
            <h3>About the class</h3>
            <p><b>Level:</b> {teacher.classDetails.level}</p>
            <p><b>Languages:</b> {teacher.classDetails.languages.join(', ')}</p>
            <p className="class-summary">{teacher.classDetails.summary}</p>
          </section>

          <section className="ratings-reviews-section">
            <h3>Reviews</h3>
            <div className="avg-rating">
              ⭐ {teacher.rating.toFixed(1)} ({teacher.reviews.length} reviews)
            </div>
            <div className="reviews-list">
              {teacher.reviews.map(review => (
                <div key={review.id} className="review">
                  <p><b>{review.user}</b> — Rating: {review.rating} ⭐</p>
                  <p>{review.comment}</p>
                  {review.teacherResponse && <p className="teacher-response"><b>Manisha's response :</b> {review.teacherResponse}</p>}
                </div>
              ))}
            </div>
          </section>

          <section className="recommendations-section">
            <h3>Recommendations</h3>
            <ul>
              {teacher.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </section>

          <section className="rates-section">
            <h3>Rates</h3>
            <p><b>Single class:</b> ₹{teacher.rates.single.toLocaleString()}</p>
            <p><b>5h pack:</b> ₹{teacher.rates.pack5h.toLocaleString()}</p>
            <p><b>10h pack:</b> ₹{teacher.rates.pack10h.toLocaleString()}</p>
            <p><b>Online:</b> ₹{teacher.rates.online.toLocaleString()}/hr</p>
            <p><b>Free trial:</b> {teacher.rates.freeTrial}</p>
          </section>

          <button className="book-class-btn">Book a Class</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
