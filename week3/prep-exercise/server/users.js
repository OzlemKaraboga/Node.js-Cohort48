import newDatabase from './database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;
const SECRET_KEY = 'secretKey';

const isPersistent = false;
const database = newDatabase({ isPersistent });

// Register Middleware
export const register = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' });
    return;
  }

  // Check if the username already exists
  if (database.getByUsername(username)) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Hash the password and create the user
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = { username, password: hashedPassword };

  // Create the user in the database
  const result = await database.create(user);
  res.status(201).json({ id: result.id, username: result.username });
};

// Login Middleware
export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await database.getByUsername(username);

  // Check if username and password are valid
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400).json({ message: 'Invalid username or password' });
    return;
  }

  // Generate JWT token for the user
  const token = jwt.sign({ id: user.id }, SECRET_KEY);
  res.status(201).json({ token });
};

// Get Profile Middleware
export const getProfile = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Check if token exists
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: invalid token' });
        return;
    }

    try {
        // Verify the token and get user profile
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = database.getById(decoded.id);

        // Check if the user exists
        if (!user) {
            res.status(401).json({ message: 'Unauthorized: invalid user' });
            return;
        }
        
        res.json({ username: user.username });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Logout Middleware
export const logout = async (req, res) => {
  // Perform logout action
  res.status(204).json({ message: 'Logout successful' });
};