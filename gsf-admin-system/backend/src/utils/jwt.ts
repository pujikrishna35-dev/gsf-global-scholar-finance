import jwt from 'jsonwebtoken';
import { AdminUser } from '../shared/types/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'gsf_super_secret_jwt_key_2026_finance_admin';

export const generateToken = (user: AdminUser): string => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
