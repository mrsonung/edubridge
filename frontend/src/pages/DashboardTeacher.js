import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileTeacher from './ProfileTeacher';
import ConfirmationModal from '../components/ConfirmationModal'; // Adjust path if needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardTeacher = () => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]); // Initialize as empty array
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser && storedRole === 'teacher') {
      setUser(JSON.parse(storedUser));
      const token = localStorage.getItem('token');

      // Fetch students interested in this teacher
      fetch('http://localhost:5000/auth/teacher/students', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          // Defensive: Ensure data is always an array before setting state
          if (Array.isArray(data)) {
            setStudents(data);
          } else if (data.students && Array.isArray(data.students)) {
            setStudents(data.students); // If response wrapped in `students` property
          } else {
            setStudents([]); // fallback to empty array if malformed response
          }
        })
        .catch(err => {
          console.error(err);
          setStudents([]); // On error, set students to empty to avoid .map error
        });
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDeleteButtonClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/auth/delete-account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Your account has been deleted.', { className: 'toastify-custom-success' });
        setTimeout(() => {
          localStorage.clear();
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await res.json();
        toast.error('Error deleting account: ' + (errorData.message || 'Unknown error'), { className: 'toastify-custom-error' });
      }
    } catch (error) {
      toast.error('Error deleting account: ' + error.message, { className: 'toastify-custom-error' });
    }
  };

  const handleCancelDelete = () => setShowConfirm(false);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-bg">
      <div className="dashboard-wrapper">
        <div className="dashboard-info">
          <h1>Welcome, <span className="username">{user.name}</span> <span className="usertype">(Teacher)</span></h1>
          <p><b>Your email:</b> {user.email}</p>
          <p><b>Your qualification:</b> {user.qualification}</p>
          <p><b>Your grades:</b> {Array.isArray(user.grades) ? user.grades.join(', ') : user.grades || ''}</p>
          <p><b>Your subjects:</b> {Array.isArray(user.subjects) ? user.subjects.join(', ') : user.subjects || ''}</p>
          <p><b>Registration Paid:</b> {user.registrationPaid ? 'Yes' : 'No'}</p>

          <button className="logout-btn" onClick={handleLogout}>Logout</button>

          <button
            onClick={handleDeleteButtonClick}
            style={{
              marginTop: '18px',
              padding: '10px 22px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '7px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 10px #e74c3c22'
            }}
          >Delete Account</button>

          <h2>Students Interested in You</h2>
          {students.length === 0 ? (
            <p>No students have reached out yet.</p>
          ) : (
            <ul>
              {students.map(student => (
                <li key={student._id}>
                  <b>Name:</b> {student.name} | <b>Email:</b> {student.email} | <b>Grade:</b> {student.grade}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-profile">
  <ProfileTeacher user={user} updateUser={setUser} />
</div>

      </div>

      {showConfirm && (
        <ConfirmationModal
          message="Are you sure you want to permanently delete your account? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} /> */}
    </div>
  );
};

export default DashboardTeacher;
