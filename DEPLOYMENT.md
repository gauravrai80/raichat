# Deployment Guide

This guide will help you deploy your MERN stack chat application to production.

## Prerequisites

Before deploying, ensure you have:
- ✅ MongoDB Atlas account (free tier available)
- ✅ Cloudinary account for file uploads
- ✅ Netlify account for frontend hosting
- ✅ Render/Railway/Heroku account for backend hosting
- ✅ Git repository with your code

---

## 1. MongoDB Atlas Setup

### Create Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your database password
6. Add `/chatapp` at the end: `mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority`

### Whitelist IP Addresses
1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for production
4. Click "Confirm"

---

## 2. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

---

## 3. Backend Deployment (Render)

### Option A: Using Render

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Service**
   - **Name**: `your-chat-app-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

3. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
   JWT_SECRET=<generate-a-strong-random-string>
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLIENT_URL=https://your-app.netlify.app
   ```

   **Generate JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-chat-app-backend.onrender.com`)

### Option B: Using Railway

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
5. Add the same environment variables as above
6. Deploy and copy your backend URL

### Option C: Using Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-chat-app-backend`
4. Set buildpack: `heroku buildpacks:set heroku/nodejs`
5. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_api_secret
   heroku config:set CLIENT_URL=https://your-app.netlify.app
   ```
6. Deploy:
   ```bash
   git subtree push --prefix server heroku main
   ```

---

## 4. Frontend Deployment (Netlify)

### Deploy to Netlify

1. **Create New Site**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

2. **Configure Build Settings**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

3. **Add Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Click "Add a variable" and add:
   ```
   VITE_API_URL=https://your-chat-app-backend.onrender.com
   VITE_SOCKET_URL=https://your-chat-app-backend.onrender.com
   VITE_APP_NAME=Chat App
   ```
   
   > **Important**: Use your actual backend URL from step 3

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Copy your frontend URL (e.g., `https://your-app.netlify.app`)

5. **Update Backend CLIENT_URL**
   - Go back to your backend hosting (Render/Railway/Heroku)
   - Update the `CLIENT_URL` environment variable with your Netlify URL
   - Redeploy the backend

---

## 5. Verify Deployment

### Test Backend
1. Visit `https://your-backend-url.onrender.com/health`
2. Should return:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "environment": "production",
     "mongodb": "connected"
   }
   ```

### Test Frontend
1. Visit your Netlify URL
2. Open browser DevTools → Console
3. Check for:
   - ✅ `🔗 API Base URL: https://your-backend-url.onrender.com/api`
   - ✅ `🔌 Connecting to Socket.IO server: https://your-backend-url.onrender.com`
   - ✅ `✅ Socket connected: <socket-id>`

### Test Full Application
1. **Register a new user**
2. **Login**
3. **Send a message**
4. **Upload a file**
5. **Check online/offline status**
6. **Test typing indicators**
7. **Refresh the page** (React Router should work)
8. **Open in another browser/incognito** and test real-time messaging

---

## 6. Troubleshooting

### Socket.IO Not Connecting
- ✅ Check that `VITE_SOCKET_URL` matches your backend URL
- ✅ Check browser console for connection errors
- ✅ Verify backend `CLIENT_URL` includes your frontend URL
- ✅ Check Network tab for WebSocket/polling connections

### CORS Errors
- ✅ Verify `CLIENT_URL` in backend matches your Netlify URL exactly
- ✅ Check for trailing slashes (should not have them)
- ✅ Ensure both URLs use HTTPS in production

### MongoDB Connection Failed
- ✅ Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- ✅ Verify connection string is correct
- ✅ Check database user has read/write permissions

### File Upload Not Working
- ✅ Verify Cloudinary credentials are correct
- ✅ Check backend logs for upload errors
- ✅ Ensure file size is under 10MB

### 404 on Page Refresh
- ✅ Verify `_redirects` file exists in `client/public/`
- ✅ Check Netlify deploy logs to confirm file was included

---

## 7. Environment Variables Reference

### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-string>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=https://your-app.netlify.app
```

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-backend.onrender.com
VITE_APP_NAME=Chat App
```

---

## 8. Post-Deployment Checklist

- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Messages send and receive in real-time
- [ ] File uploads work
- [ ] Online/offline status updates
- [ ] Typing indicators work
- [ ] Page refresh doesn't break routing
- [ ] Socket.IO reconnects after disconnect
- [ ] No CORS errors in console
- [ ] HTTPS is enabled on both frontend and backend

---

## 9. Monitoring & Maintenance

### Check Logs
- **Render**: Dashboard → Logs
- **Railway**: Dashboard → Deployments → Logs
- **Netlify**: Site → Deploys → Deploy log

### Update Environment Variables
If you need to update environment variables:
1. Update in hosting platform dashboard
2. Redeploy the application
3. Clear browser cache and test

### Scaling
- **Free Tier Limitations**:
  - Render: Spins down after 15 minutes of inactivity
  - Railway: 500 hours/month free
  - Netlify: 100GB bandwidth/month

- **Upgrade Options**: Consider paid plans for production apps with high traffic

---

## 10. Security Best Practices

✅ **Implemented**:
- Environment variables for secrets
- CORS configuration
- JWT authentication
- Body parser limits (10MB)
- Disabled x-powered-by header
- MongoDB connection retry logic
- Graceful shutdown handling

🔒 **Recommended Additions** (Optional):
- Rate limiting (see implementation plan)
- Helmet.js for security headers
- Input validation
- Request logging
- SSL/TLS certificates (automatic with Netlify/Render)

---

## Need Help?

- Check backend logs for errors
- Check browser console for frontend errors
- Verify all environment variables are set correctly
- Test locally first with production environment variables
- Ensure MongoDB Atlas IP whitelist is configured

**Common Issues**: See Troubleshooting section above

---

**Congratulations!** 🎉 Your chat app is now deployed and ready for production use!
