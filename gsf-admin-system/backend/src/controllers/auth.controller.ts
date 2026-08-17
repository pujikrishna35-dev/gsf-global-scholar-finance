import { Request, Response } from 'express';
import { initialAdmins } from '../config/database';
import { generateToken } from '../utils/jwt';

export const loginAdmin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  // Pre-configured Admin Demo Login (admin@gsf.com / Admin@123 or any password for demo)
  const admin = initialAdmins.find(a => a.email.toLowerCase() === email.toLowerCase());

  if (!admin && email !== 'admin@gsf.com') {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
  }

  const activeAdmin = admin || initialAdmins[0];
  const token = generateToken(activeAdmin);

  return res.json({
    success: true,
    message: 'Admin authentication successful.',
    token,
    user: activeAdmin
  });
};

export const getMe = (req: any, res: Response) => {
  return res.json({
    success: true,
    user: req.user
  });
};
