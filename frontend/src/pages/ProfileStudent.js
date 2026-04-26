import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileStudent = ({ user, updateUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [profilePic, setProfilePic] = useState(null);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePicChange = e =>
    setProfilePic(e.target.files[0]);

  const handleSave = async e => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', form.name);
    data.append('grade', form.grade);
    data.append('subjects', form.subjects);

    if (profilePic) {
      data.append('profilePic', profilePic);
    }

    try {
      const token = localStorage.getItem('token');

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/update/student/${user._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem('user', JSON.stringify(res.data));
      updateUser(res.data);
      setForm(res.data);
      setEditMode(false);
      setProfilePic(null);

      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="profile-section">
      <h3>Profile</h3>

      <img
        src={form.profilePic || 'https://via.placeholder.com/120x120.png?text=No+Image'}
        alt="Profile"
        className="profile-pic"
        key={form.profilePic}
      />

      {editMode ? (
        <form onSubmit={handleSave}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />

          <input
            name="grade"
            value={form.grade}
            onChange={handleChange}
            placeholder="Grade"
            required
          />

          <input
            name="subjects"
            value={Array.isArray(form.subjects) ? form.subjects.join(', ') : form.subjects}
            onChange={e => setForm({ ...form, subjects: e.target.value })}
            placeholder="Subjects"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handlePicChange}
          />

          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Grade:</strong> {user.grade}</p>
          <p><strong>Subjects:</strong> {Array.isArray(user.subjects) ? user.subjects.join(', ') : user.subjects}</p>

          <button onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default ProfileStudent;