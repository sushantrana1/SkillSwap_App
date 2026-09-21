# 🔄 SkillSwap

### A Peer-to-Peer Skill Exchange Platform for Learning, Teaching, and Connecting

> **SkillSwap** is a full-stack skill exchange platform that connects people based on the skills they can teach and the skills they want to learn. Users can create profiles, discover compatible learners and teachers, send skill-swap requests, communicate through real-time chat, and receive activity notifications.

<p align="center">
  <a href="YOUR_FRONTEND_URL">
    <strong>🌐 Live Demo</strong>
  </a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="YOUR_GITHUB_REPOSITORY_URL">
    <strong>📦 Repository</strong>
  </a>
</p>

---

## 📌 Overview

Learning a new skill often requires finding the right person to learn from, while many people already have valuable skills they could teach to others.

**SkillSwap** provides a platform where users can exchange knowledge directly with one another.

Users can create a profile containing the skills they can teach and the skills they want to learn. The platform then helps users discover compatible people through its skill-matching system.

Users can:

* Discover other learners and teachers
* Find compatible skill matches
* Send and manage skill-swap requests
* Accept requests and start conversations
* Communicate through real-time chat
* Receive notifications about important activities

The project was built as a **real-world full-stack MERN application** with a focus on usability, responsive design, real-time communication, authentication, authorization, and security.

---

## ✨ Key Features

### 👤 User Features

* 🔐 **Authentication**

  * User registration
  * Secure login
  * JWT-based authentication
  * Protected routes
  * Password hashing with bcrypt
  * Persistent authentication

* 👤 **Profile Management**

  * Create and update profiles
  * Upload profile images
  * Add biography
  * Add location
  * Add experience
  * Set availability
  * Select skills to teach
  * Select skills to learn

* 🧑‍🏫 **Skill Management**

  * Browse available skills
  * Categorized skills
  * Skill descriptions
  * Select multiple teaching skills
  * Select multiple learning skills

---

### 🔎 Explore Features

* 🔍 **Discover Users**

  * Browse other users
  * Explore their skills
  * View teaching and learning interests
  * Filter and search users
  * Exclude the current user from discovery

* 👤 **Public Profiles**

  * View another user's profile
  * See their skills
  * View experience
  * View availability
  * View profile image

---

### 🤝 Matching System

SkillSwap includes an automated skill-matching system that identifies users with compatible learning and teaching interests.

The system compares:

* Skills the user wants to learn
* Skills another user can teach
* Skills the user can teach
* Skills another user wants to learn

The matching system also considers **two-way compatibility**.

For example:

```text
User A wants to learn React
        ↓
User B can teach React

User B wants to learn Python
        ↓
User A can teach Python
```

This creates a potential two-way skill exchange.

The platform calculates a compatibility score to help users discover relevant matches.

---

### 📩 Skill Swap Requests

* Send skill-swap requests
* Receive incoming requests
* View sent requests
* Accept requests
* Reject requests
* Track request status
* Prevent duplicate requests
* Prevent reverse duplicate requests

Request states include:

```text
Pending
Accepted
Rejected
```

---

### 💬 Real-Time Chat

After a skill-swap request is accepted, users can communicate through real-time chat.

* Real-time messaging
* Socket.IO communication
* Persistent message storage
* Conversation history
* Conversation authorization
* Accepted-request verification
* Message notifications
* Responsive chat interface
* Mobile-friendly chat navigation

Only authenticated participants of an authorized conversation can access and send messages.

---

### 🔔 Notifications

Users receive notifications for important activities such as:

* New skill-swap requests
* Accepted requests
* Rejected requests
* New messages

The notification system includes:

* Notification feed
* Unread notification count
* Notification badge
* Mark as read
* Mark all as read

---

### 📊 Dashboard

The SkillSwap dashboard provides a centralized overview of user activity.

It includes:

* Profile overview
* Matching statistics
* Request statistics
* Recent activity
* Quick actions
* Navigation to major platform features

---

## 🧠 How the Platform Works

```text
User
   │
   ▼
Create Account
   │
   ▼
Create Profile
   │
   ├── Skills to Teach
   ├── Skills to Learn
   ├── Experience
   └── Availability
   │
   ▼
Explore Users
   │
   ▼
Skill Matching
   │
   ▼
Compatible User
   │
   ▼
Send Skill Swap Request
   │
   ▼
Request Accepted
   │
   ▼
Start Conversation
   │
   ▼
Real-Time Chat
```

This workflow creates a simple cycle where users can both **learn from others and teach what they already know**.

---

## 🎯 Skill Matching System

The matching system is based on the relationship between teaching and learning interests.

For example:

### User A

**Can Teach**

```text
JavaScript
Python
```

**Wants to Learn**

```text
React
Node.js
```

### User B

**Can Teach**

```text
React
Node.js
```

**Wants to Learn**

```text
Python
```

The platform identifies compatibility in both directions:

```text
User A learns React
        ↑
User B teaches React


User B learns Python
        ↑
User A teaches Python
```

A match score is then calculated based on the skill overlap.

This helps users discover people with meaningful skill exchange opportunities.

---

## 🛠️ Technology Stack

| Layer                       | Technologies              |
| --------------------------- | ------------------------- |
| **Frontend**                | React, Vite               |
| **Routing**                 | React Router              |
| **HTTP Client**             | Axios                     |
| **Real-Time Client**        | Socket.IO Client          |
| **Backend**                 | Node.js, Express          |
| **Database**                | MongoDB                   |
| **ODM**                     | Mongoose                  |
| **Authentication**          | JWT                       |
| **Password Security**       | bcryptjs                  |
| **Real-Time Communication** | Socket.IO                 |
| **Image Upload**            | Multer                    |
| **Image Storage**           | Cloudinary                |
| **Security Headers**        | Helmet                    |
| **Cross-Origin Security**   | CORS                      |
| **Frontend Deployment**     | Vercel / Similar Platform |
| **Backend Deployment**      | Render / Similar Platform |

---

## 🏗️ Architecture

SkillSwap follows a client-server architecture:

```text
                    ┌─────────────────────┐
                    │       User          │
                    │    React Frontend   │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │      Express        │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐    ┌────────────┐   ┌────────────┐
        │ MongoDB   │    │ Cloudinary │   │    JWT     │
        │ Database  │    │   Images   │   │    Auth    │
        └───────────┘    └────────────┘   └────────────┘
                              
                    ┌─────────────────────┐
                    │      Socket.IO      │
                    │   Real-Time Chat    │
                    └─────────────────────┘
```

---

## 📁 Project Structure

```text
SkillSwap/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── Reusable UI components
│   │   │
│   │   ├── context/
│   │   │   └── Authentication context
│   │   │
│   │   ├── pages/
│   │   │   ├── Chat
│   │   │   ├── Dashboard
│   │   │   ├── Explore
│   │   │   ├── Login
│   │   │   ├── Matches
│   │   │   ├── Notifications
│   │   │   ├── Profile
│   │   │   ├── Public Profile
│   │   │   ├── Register
│   │   │   └── Requests
│   │   │
│   │   ├── services/
│   │   │   └── API configuration
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   │   ├── Database configuration
│   │   └── Cloudinary configuration
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── exploreController.js
│   │   ├── matchingController.js
│   │   ├── notificationController.js
│   │   ├── profileController.js
│   │   ├── requestController.js
│   │   └── skillController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Profile.js
│   │   ├── Request.js
│   │   ├── Skill.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── exploreRoutes.js
│   │   ├── matchingRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── requestRoutes.js
│   │   └── skillRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* **Node.js 18+**
* **npm**
* **MongoDB** or MongoDB Atlas
* **Cloudinary account**

---

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL

cd SkillSwap
```

---

## 2. Configure the Backend

Navigate to the backend:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm run dev
```

Or:

```bash
npm start
```

The backend will normally run on:

```text
http://localhost:5000
```

---

## 3. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔐 Security

Security was considered throughout the application architecture.

Implemented security measures include:

* JWT-based authentication
* Protected API routes
* Password hashing using bcrypt
* Helmet security headers
* CORS configuration
* Request body size limiting
* File upload size limiting
* Image MIME-type validation
* Single-file upload restriction
* Authenticated Socket.IO connections
* Conversation participant authorization
* Accepted-request verification before chat
* User-specific profile updates
* Duplicate request protection
* Reverse duplicate request protection
* Generic authentication error messages
* Protection against unauthorized access to user-specific resources

Profile image uploads are limited to:

```text
5 MB
```

Supported formats:

```text
JPG
JPEG
PNG
WEBP
```

---

# 💬 Real-Time Communication

SkillSwap uses **Socket.IO** for real-time communication.

The chat flow works as follows:

```text
User Login
   │
   ▼
JWT Authentication
   │
   ▼
Socket Connection
   │
   ▼
Conversation Authorization
   │
   ▼
Accepted Skill Swap Request
   │
   ▼
Join Conversation Room
   │
   ▼
Send Message
   │
   ▼
Save Message to MongoDB
   │
   ▼
Broadcast Message
   │
   ▼
Create Notification
```

This allows messages to appear instantly without requiring the page to be refreshed.

---

# 🗄️ Database Models

SkillSwap uses MongoDB with Mongoose.

### User

Stores authentication and account information.

```text
name
email
password
role
profileImage
```

### Profile

Stores user skill and profile information.

```text
user
bio
location
profileImage
skillsToTeach
skillsToLearn
experience
availability
```

### Skill

Stores the available skills users can select.

### Request

Stores skill-swap requests between users.

```text
sender
receiver
status
```

### Conversation

Stores conversations between users.

```text
participants
lastMessage
```

### Message

Stores individual chat messages.

```text
conversation
sender
text
```

### Notification

Stores notifications generated by platform activity.

```text
recipient
sender
type
message
relatedId
read
```
---

# ⚠️ Known Limitations

* Real-time chat requires an active Socket.IO connection.
* Profile images depend on Cloudinary availability.
* MongoDB is required for persistent application data.
* Production deployment requires updating frontend and backend CORS configuration.
* JWT tokens currently use a fixed expiration period configured by the backend.
* Email verification and password recovery are not currently implemented.
* Advanced moderation and reporting functionality is not currently implemented.

---

# 🔮 Future Improvements

Potential future improvements include:

* 📧 Email verification
* 🔑 Forgot password and password reset
* 🔐 OAuth authentication
* ⭐ User ratings and reviews
* 📅 Skill-swap session scheduling
* 📍 Location-based matching
* 🟢 Online/offline user status
* ✍️ Typing indicators
* ✓ Message read receipts
* 📎 File and image sharing in chat
* 🔔 Browser push notifications
* 🛡️ User reporting and moderation
* 👨‍💼 Admin dashboard
* 📊 Advanced analytics
* 🤖 AI-powered skill recommendations
* 📱 Progressive Web App support

---

# 🌱 Why SkillSwap?

SkillSwap is designed around a simple idea:

> **Everyone has something they can teach, and everyone has something they can learn.**

Instead of treating learning as a one-way process, SkillSwap creates opportunities for people to exchange knowledge directly.

The project demonstrates how modern web technologies can be combined to build a practical platform involving:

* Authentication
* Authorization
* User profiles
* Search and discovery
* Recommendation logic
* Real-time communication
* Notifications
* Cloud storage
* Responsive UI
* Secure REST APIs
* MongoDB relationships

---

# 📄 License

This project is currently intended for educational and personal development purposes.

If you plan to distribute the project publicly, add an appropriate open-source license such as the MIT License.

---

# 👨‍💻 Developer

**Sushant Rana**

GitHub:

```
https://github.com/sushantrana1/SkillSwap_Project
```

---

<p align="center">
  🔄 <strong>SkillSwap — Learn, Teach, Connect.</strong>
</p>
