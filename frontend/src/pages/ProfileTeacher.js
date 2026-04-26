import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
const totalEarnings = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const viewingId = id || propUser?._id;
  const isOwner = role === 'teacher' && loggedInUserId === viewingId;

  // ✅ Load teacher
  useEffect(() => {
    if (!propUser && viewingId) {
      axios.get(`${process.env.REACT_APP_API_URL}/auth/teacher/${viewingId}`)
        .then(res => {
          // console.log("TEACHER:", res.data);
          setTeacher(res.data);
          setForm(res.data);
        })
        .catch(() => setTeacher(null));
    }
  }, [propUser, viewingId]);

  // ✅ LOAD BOOKINGS (MAIN FIX)
  useEffect(() => {
    if (!teacher?._id) return;

    // console.log("CALL API WITH:", teacher._id);

    axios.get(`${process.env.REACT_APP_API_URL}/booking/teacher/${teacher._id}`)
      .then(res => {
        // console.log("BOOKINGS RESPONSE:", res.data);
        setBookings(res.data);
      })
      .catch(err => console.log("BOOKING ERROR:", err));

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
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTeacher(res.data);
      setForm(res.data);
      setEditMode(false);
      toast.success("Profile updated");

    } catch {
      toast.error("Update failed");
    }
  };

  // ✅ Razorpay
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
        toast.success("Payment Successful 🎉");

        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/booking/create`, {
            teacherId: teacher._id,
            studentId: loggedInUserId,
            paymentId: response.razorpay_payment_id,
            amount: 500,
            status: "success"
          });

          // 🔥 refresh bookings
          const res = await axios.get(
            `http://localhost:5000/booking/teacher/${teacher._id}`
          );

          console.log("UPDATED BOOKINGS:", res.data);
          setBookings(res.data);

        } catch (err) {
          console.log(err);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="profile-section">
      <ToastContainer position="top-center" />

      <h2>Teacher Profile</h2>

      <img
        src={teacher.profilePic || "/default_profile.png"}
        alt="Profile"
        className="profile-pic"
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
            <button className='book-btn' onClick={handleBooking}>
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

              <button className='book-btn' onClick={() => setEditMode(true)}>
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