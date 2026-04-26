import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileTeacher from '../pages/ProfileTeacher';

const ProfileTeacherWrapper = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser && (storedRole === 'teacher' || storedRole === 'student')) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // Redirect guests to login
    }
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return <ProfileTeacher user={user} updateUser={setUser} />;
};

export default ProfileTeacherWrapper;
