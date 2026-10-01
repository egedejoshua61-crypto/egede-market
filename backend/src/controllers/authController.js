import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { getAssignedRole } from '../utils/roles.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'BUYER' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const assignedRole = getAssignedRole(normalizedEmail, role);

    const result = await query(
      `
        INSERT INTO users (name, email, password_hash, role, status, verification_level)
        VALUES ($1, $2, $3, $4, 'active', 'Basic Seller')
        RETURNING id, name, email, role, status, verification_level, created_at
      `,
      [name, normalizedEmail, passwordHash, assignedRole]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verification_level: user.verification_level,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Unable to register user.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [String(email).trim().toLowerCase()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'This account is currently suspended or inactive.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verification_level: user.verification_level,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Unable to log in.' });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.json({ user: req.user });
};

export const logoutUser = async (req, res) => {
  return res.json({ message: 'Logout successful. Please clear the stored JWT on the client.' });
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  return res.json({
    message: 'Password reset instructions sent. (Demo mode: no email is actually sent.)',
    email,
  });
};

export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password) {
    return res.status(400).json({ message: 'Email, token, and new password are required.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await query('UPDATE users SET password_hash = $1 WHERE email = $2', [passwordHash, String(email).trim().toLowerCase()]);

  return res.json({ message: 'Password reset successful.' });
};
