const fs = require('fs');
const path = require('path');

console.log('=== Environment Files Verification ===\n');

// Check server .env
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (fs.existsSync(serverEnvPath)) {
    const content = fs.readFileSync(serverEnvPath, 'utf8');
    console.log('✅ server/.env exists (' + content.length + ' bytes)');
    console.log('\nServer .env content:');
    console.log('---');
    console.log(content);
    console.log('---\n');

    // Check for required variables
    const hasMongoURI = content.includes('MONGODB_URI=mongodb+srv://');
    const hasJWT = content.includes('JWT_SECRET=');
    const hasClientURL = content.includes('CLIENT_URL=');

    console.log('Required variables check:');
    console.log('  MONGODB_URI:', hasMongoURI ? '✅' : '❌');
    console.log('  JWT_SECRET:', hasJWT ? '✅' : '❌');
    console.log('  CLIENT_URL:', hasClientURL ? '✅' : '❌');
} else {
    console.log('❌ server/.env NOT FOUND');
}

console.log('\n');

// Check client .env
const clientEnvPath = path.join(__dirname, 'client', '.env');
if (fs.existsSync(clientEnvPath)) {
    const content = fs.readFileSync(clientEnvPath, 'utf8');
    console.log('✅ client/.env exists (' + content.length + ' bytes)');
    console.log('\nClient .env content:');
    console.log('---');
    console.log(content);
    console.log('---\n');

    const hasAPIURL = content.includes('VITE_API_URL=');
    console.log('Required variables check:');
    console.log('  VITE_API_URL:', hasAPIURL ? '✅' : '❌');
} else {
    console.log('❌ client/.env NOT FOUND');
}
