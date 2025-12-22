const fs = require('fs');
const path = require('path');

// Server .env content
const serverEnv = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database
# For production: Use MongoDB Atlas connection string
# Example: mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://gauravrai2240_db_user:gaurav224042@chatapp.rlihjzv.mongodb.net/?appName=chatapp

# JWT Secret (CRITICAL: Change this in production!)
# Generate a strong secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=gaurav224042

# Cloudinary Configuration (get these from cloudinary.com)
CLOUDINARY_CLOUD_NAME=dn5vrvg69
CLOUDINARY_API_KEY=427865646477266
CLOUDINARY_API_SECRET=hl0erffGyu_j8iZX_IscljvG2A8


# Client URL (for CORS)
# For development: http://localhost:5173
# For production: https://your-app.netlify.app
# Multiple origins: https://app1.com,https://app2.com
CLIENT_URL=http://localhost:5173,https://raichat.netlify.app
`;

// Client .env content
const clientEnv = `# Development Environment Variables
VITE_API_URL=http://localhost:5000
`;

// Write server .env
const serverEnvPath = path.join(__dirname, 'server', '.env');
fs.writeFileSync(serverEnvPath, serverEnv, 'utf8');
console.log('✅ Created server/.env');

// Write client .env
const clientEnvPath = path.join(__dirname, 'client', '.env');
fs.writeFileSync(clientEnvPath, clientEnv, 'utf8');
console.log('✅ Created client/.env');

console.log('\n📋 Server .env content:');
console.log(fs.readFileSync(serverEnvPath, 'utf8'));

console.log('\n📋 Client .env content:');
console.log(fs.readFileSync(clientEnvPath, 'utf8'));
