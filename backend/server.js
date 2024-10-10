// backend/server.js
const app = require('./app'); // Import the app setup
require('dotenv').config(); // Load environment variables

// Server and Database Connection Logic
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});