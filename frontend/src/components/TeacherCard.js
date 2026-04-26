import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherCard = ({ teacher, studentUser, onFavorite }) => {
  const navigate = useNavigate();

  const handleFavoriteClick = () => {
    if (!studentUser) {
      // Redirect unregistered user to student registration
      navigate('/register-student');
    } else {
      onFavorite(teacher._id);
    }
  };

  // Show filled heart if favorited, else outline heart
  const isFavorited = studentUser?.favorites?.includes(teacher._id);

  return (
    <div className="teacher-card">
      <div className="teacher-img-wrap" style={{ position: 'relative' }}>
        <img
          src={
            teacher.profilePic && teacher.profilePic.startsWith('/')
              ? process.env.PUBLIC_URL + teacher.profilePic
              : teacher.profilePic || process.env.PUBLIC_URL + '/default_profile.png'
          }
          alt={teacher.name}
          className="teacher-img"
        />
        <button
          className={`fav-btn${isFavorited ? ' active' : ''}`}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleFavoriteClick}
          style={{
            position: 'absolute',
            top: '8px',
            right: '13px',
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontSize: '1.4em',
            color: '#ea1851',
            boxShadow: '0 2px 6px #a2b9ec33',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <span style={{ fontSize: '1.3em' }}>{isFavorited ? '❤️' : '🤍'}</span>
        </button>
      </div>
      <h3 className="teacher-name">{teacher.name}</h3>
      <div className="teacher-city">{teacher.city || 'Location Not Set'} (face to face & online)</div>
      <div className="teacher-details">
        <p><strong>Email:</strong> {teacher.email}</p>
        <p><strong>Qualification:</strong> {teacher.qualification}</p>
        <p><strong>Grades:</strong> {Array.isArray(teacher.grades) ? teacher.grades.join(', ') : teacher.grades}</p>
        <p><strong>Subjects:</strong> {Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : teacher.subjects}</p>
      </div>
      <div className="teacher-meta">
        <span className="star">&#9733; 5</span>
        <span className="reviews">(0 reviews)</span>
        <span className="teacher-type">Super Teacher</span>
      </div>
    </div>
  );
};

export default TeacherCard;
