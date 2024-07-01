// Import required modules
import express from 'express';

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// GET request to /
app.get('/', (req, res) => {
  res.send('hello from backend to frontend!');
});

// POST request to /weather
app.post('/weather', (req, res) => {
  const { cityName } = req.body;
  res.send(`You submitted: ${cityName}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});