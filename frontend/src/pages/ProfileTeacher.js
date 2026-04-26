import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfileTeacher = ({ user: propUser }) => {
  const { id } = useParams();

  const [teacher, setTeacher] = useState(propUser || null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(propUser || {});
  const [profilePic, setProfilePic] = useState(null);
  const [bookings, setBookings] = useState([]);

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const loggedInUserId = loggedInUser?._id;
  const role = localStorage.getItem('role');

  const viewingId = id || propUser?._id;
  const isOwner = role === 'teacher' && loggedInUserId === viewingId;

  const totalEarnings = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  useEffect(() => {
    if (!propUser && viewingId) {
      axios.get(`${process.env.REACT_APP_API_URL}/auth/teacher/${viewingId}`)
        .then(res => {
          setTeacher(res.data);
          setForm(res.data);
        })
        .catch(() => setTeacher(null));
    }
  }, [propUser, viewingId]);

  useEffect(() => {
    if (!teacher?._id) return;

    axios.get(`${process.env.REACT_APP_API_URL}/booking/teacher/${teacher._id}`)
      .then(res => setBookings(res.data))
      .catch(() => {});
  }, [teacher?._id]);

  if (!teacher) return <div>Loading...</div>;

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePicChange = e =>
    setProfilePic(e.target.files[0]);

  const handleSave = async e => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach(key => {
      data.append(key, form[key]);
    });

    if (profilePic) data.append("profilePic", profilePic);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/update/teacher/${teacher._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTeacher(res.data);
      setForm(res.data);
      setEditMode(false);
      setProfilePic(null);

      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const loadRazorpay = () =>
    new Promise(resolve => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleBooking = () => {
    if (!localStorage.getItem("token")) {
      toast.info("Login required");
      window.location.href = "/login";
      return;
    }

    openPayment();
  };

  const openPayment = async () => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Payment failed");
      return;
    }

    const options = {
      key: "rzp_test_SiBDmK2Zlj6QOy",
      amount: 50000,
      currency: "INR",
      name: "EduBridge",
      handler: async (response) => {
        toast.success("Payment Successful");

        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/booking/create`, {
            teacherId: teacher._id,
            studentId: loggedInUserId,
            paymentId: response.razorpay_payment_id,
            amount: 500,
            status: "success"
          });

          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/booking/teacher/${teacher._id}`
          );

          setBookings(res.data);
        } catch {}
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="profile-section">
      <h2>Teacher Profile</h2>

      <img
        src={teacher.profilePic || "/default_profile.png"}
        alt="Profile"
        className="profile-pic"
        key={teacher.profilePic}
      />

      {editMode ? (
         <form onSubmit={handleSave}>
          <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Name" />
          <input name="qualification" value={form.qualification || ''} onChange={handleChange} placeholder="Qualification" />
          <input name="subjects" value={form.subjects || ''} onChange={handleChange} placeholder="Subjects" />
          <input name="experience" value={form.experience || ''} onChange={handleChange} placeholder="Experience" />
          <input name="location" value={form.location || ''} onChange={handleChange} placeholder="Location" />
          <textarea name="bio" value={form.bio || ''} onChange={handleChange} placeholder="Bio" />

          <input type="file" onChange={handlePicChange} />

          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <p><strong>Name:</strong> {teacher.name}</p>
          <p><strong>Qualification:</strong> {teacher.qualification}</p>
          <p><strong>Subjects:</strong> {teacher.subjects}</p>
          <p><strong>Experience:</strong> {teacher.experience}</p>
          <p><strong>Location:</strong> {teacher.location}</p>

          {!isOwner && (
            <button onClick={handleBooking}>
              Book Your Slot
            </button>
          )}

          {isOwner && (
            <>
              <h3>My Bookings</h3>
              <p>Total Bookings: {bookings.length}</p>

              <h3>Earnings</h3>
              <p>Total Earnings: ₹{totalEarnings}</p>

              {bookings.length === 0 ? (
                <p>No bookings yet</p>
              ) : (
                <ul>
                  {bookings.map((b, i) => (
                    <li key={i}>
                      {b.studentId?.name || "Student"} booked you
                    </li>
                  ))}
                </ul>
              )}

              <button onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileTeacher;