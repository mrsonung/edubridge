import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileStudent from './ProfileStudent';
import ConfirmationModal from '../components/ConfirmationModal'; // Adjust path if needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import '../styles.css'; // Import your custom toast styles

const DashboardStudent = () => {
  const [user, setUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser && storedRole === 'student') {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');  // Use navigate for SPA routing
    }
  }, [navigate]);

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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
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
          <h1>
            Welcome, <span className="username">{user.name}</span> <span className="usertype">(Student)</span>
          </h1>
          <p><b>Your email:</b> {user.email}</p>
          <p><b>Your grade:</b> {user.grade}</p>
          <p><b>Your subjects:</b> {Array.isArray(user.subjects) ? user.subjects.join(', ') : user.subjects || ''}</p>
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
          >
            Delete Account
          </button>
        </div>

        <div className="dashboard-profile">
          <ProfileStudent user={user} updateUser={setUser} />
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <ConfirmationModal
          message="Are you sure you want to permanently delete your account? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} />
    </div>
  );
};

export default DashboardStudent;
