import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const { username, password } = req.body;
    console.log(`[Login Debug] Attempting login for username: '${username}'`);

    const user = await User.findOne({ username });

    if (!user) {
      console.log(`[Login Debug] User not found in DB for username: '${username}'`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`[Login Debug] User found: ${user._id}, Role: ${user.role}, Hash: ${user.passwordHash ? user.passwordHash.substring(0, 10) + '...' : 'MISSING'}`);

    const valid = await bcrypt.compare(password, user.passwordHash);
    console.log(`[Login Debug] Password valid: ${valid}`);

    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, username: user.username } });
  } catch (err) {
    console.error('[Login Debug] Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const register = async (req, res) => {
  const User = (await import('../models/User.js')).default;
  const { name, username, password, role } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ message: 'User already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  // Default role to LabStaff if not provided, or fallback to 'user' which is now in enum
  const userRole = role || 'LabStaff';
  const user = await User.create({ name: name || username, username, passwordHash, role: userRole });
  res.status(201).json({ id: user._id, name: user.name, username: user.username, role: user.role });
};
