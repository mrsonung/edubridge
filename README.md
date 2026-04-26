# edubridge-platform 
# EduBridge

EduBridge is a full-stack web application that connects students with qualified teachers for personalized learning. It allows users to register, explore teachers, book sessions, and manage profiles with secure authentication and online payments.

---

## Features

### Student
- Register and login
- Update profile with image upload
- Browse teachers
- Book sessions
- Secure payment integration

### Teacher
- Register and login
- Create and update profile
- Upload profile image
- View bookings
- Track earnings

### General
- Authentication using JWT
- Image upload using Cloudinary
- Responsive frontend (React)
- REST API backend (Node.js + Express)
- MongoDB database integration

---

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer + Cloudinary

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure
edubridge/
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ └── App.js
│ └── public/
│
├── backend/
│ ├── routes/
│ ├── models/
│ ├── config/
│ ├── middleware/
│ └── server.js
│
└── README.md


---

## Installation

### Clone Repository
git clone https://github.com/mrsonung/edubridge.git

cd edubridge
---

### Backend Setup
cd backend
npm install

Create `.env` file:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

Run backend:
npm start

### Frontend Setup
cd frontend
npm install

Create `.env` file:

REACT_APP_API_URL=https://your-backend-url

Run frontend:

npm start


---

## API Overview

### Authentication
- POST /auth/register/student
- POST /auth/register/teacher
- POST /auth/login

### Profile Management
- PUT /auth/update/student/:id
- PUT /auth/update/teacher/:id

### Teachers
- GET /auth/teachers
- GET /auth/teacher/:id

### Booking
- POST /booking/create
- GET /booking/teacher/:id

---

## Highlights

- Real-world full-stack project with deployment
- Secure authentication and protected routes
- Cloud-based image handling
- Clean UI with user-focused design
- Scalable backend structure

---

## Future Scope

- Chat system between users
- Rating and review system
- Advanced search and filtering
- Admin dashboard
- Notification system

---

## Author

Sonu Nigam  
B.Tech CSE Student | Frontend Developer | Full Stack Learner  

Email: ksonunigam2004@gmail.com  

---

## License

This project is licensed under the MIT License.