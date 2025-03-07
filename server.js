// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Serve the static files (like your Three.js app)
app.use(express.static(path.join(__dirname, "dist"))); // Or 'public' if that's your folder

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
