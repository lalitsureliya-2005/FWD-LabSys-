import express from 'express';
import { login, register } from '../controllers/authController.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, username: user.username, role: user.role });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
