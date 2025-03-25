const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// API Endpoint
app.post("/ask-question", (req, res) => {
  const question = req.body.question;
  const answer = `You asked: ${question}. This is a sample response from Node.js.`;
  res.json({ answer });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
