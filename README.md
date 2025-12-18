# 💬 Real-Time Chat Application

A full-featured, production-ready real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO.

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- 💬 **Private Messaging** - One-on-one conversations with real-time message delivery
- 👥 **Group Chats** - Create and manage group conversations
- ⌨️ **Typing Indicators** - See when others are typing in real-time
- 🟢 **Online Status** - Real-time online/offline user status tracking
- 📎 **File Sharing** - Upload and share images and documents via Cloudinary
- 💾 **Message History** - All messages are persisted in MongoDB
- 📱 **Responsive Design** - Beautiful, modern UI with Tailwind CSS
- 🎨 **Glassmorphic UI** - Stunning gradient backgrounds and glass effects

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **date-fns** - Date formatting
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud file storage

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** (free tier available) - [Sign up](https://cloudinary.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd chatapp
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
```

**Configure your `.env` file:**

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/chatapp
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration (from your Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure your `.env` file:**

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Chat App
```

> **Note**: For local development, the API URL should NOT include `/api` suffix. The client will automatically append it.

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### 5. Run the Application

**Terminal 1 - Start Backend Server:**

```bash
cd server
npm run dev
```

Server will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**

```bash
cd client
npm run dev
```

Client will run on `http://localhost:5173`

## 🌐 Production Deployment

Ready to deploy your chat app to production? Follow our comprehensive deployment guide:

**📘 [View Deployment Guide](DEPLOYMENT.md)**

The guide covers:
- ✅ MongoDB Atlas setup
- ✅ Cloudinary configuration
- ✅ Backend deployment (Render/Railway/Heroku)
- ✅ Frontend deployment (Netlify)
- ✅ Environment variables setup
- ✅ Troubleshooting common issues
- ✅ Post-deployment verification

### Quick Deploy Summary

1. **Backend**: Deploy to Render/Railway/Heroku with environment variables
2. **Frontend**: Deploy to Netlify with `VITE_API_URL` and `VITE_SOCKET_URL`
3. **Database**: Use MongoDB Atlas (free tier available)
4. **File Storage**: Configure Cloudinary credentials

> **Important**: Make sure to update `CLIENT_URL` on backend and `VITE_API_URL`/`VITE_SOCKET_URL` on frontend with your production URLs!

## 📖 Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Start Chatting**:
   - Click "New Chat" to see all users
   - Click on a user to start a private conversation
   - Send text messages or upload files
   - See typing indicators and online status in real-time

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search?query=` - Search users
- `PUT /api/users/profile` - Update profile

### Conversations
- `GET /api/conversations` - Get user's conversations
- `POST /api/conversations` - Create/get private conversation
- `POST /api/conversations/group` - Create group conversation
- `PUT /api/conversations/:id/members` - Add group members

### Messages
- `GET /api/messages/:conversationId` - Get conversation messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read

### Upload
- `POST /api/upload` - Upload file to Cloudinary

## 🔄 Socket.IO Events

### Client → Server
- `user:online` - User connects
- `conversation:join` - Join conversation room
- `conversation:leave` - Leave conversation room
- `message:send` - Send message
- `typing:start` - Start typing
- `typing:stop` - Stop typing

### Server → Client
- `user:status` - User online/offline status update
- `message:receive` - New message received
- `typing:display` - Typing indicator update

## 📁 Project Structure

```
chatapp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Node.js backend
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── middleware/       # Custom middleware
    ├── models/           # Mongoose models
    ├── routes/           # API routes
    ├── socket/           # Socket.IO handlers
    ├── index.js          # Server entry point
    └── package.json
```

## 🎨 Key Features Explained

### Real-Time Messaging
Messages are delivered instantly using Socket.IO. When a user sends a message, it's emitted to the server and broadcast to all participants in the conversation room.

### Typing Indicators
When a user types, a `typing:start` event is emitted. After 2 seconds of inactivity, `typing:stop` is emitted automatically.

### Online Status
User online status is tracked via Socket.IO connections. When a user connects/disconnects, their status is updated in the database and broadcast to all clients.

### File Upload
Files are uploaded to Cloudinary for cloud storage. Multer handles the multipart form data, and files are streamed directly to Cloudinary.

## 🔒 Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- HTTP-only cookies option for token storage
- CORS configured for specific origins
- Input validation on all endpoints
- File type and size validation for uploads

## 🚧 Future Enhancements

- [ ] Message reactions (emoji)
- [ ] Voice/video calling
- [ ] Message search functionality
- [ ] User blocking
- [ ] Message deletion
- [ ] Read receipts
- [ ] Push notifications
- [ ] Dark mode

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ by a MERN Stack Developer

---

**Happy Chatting! 💬**
