import { Request, Response, NextFunction } from 'express';
import { studentsStore } from '../config/database';

export interface AuthenticatedStudentRequest extends Request {
  studentId?: string;
  mobile?: string;
}

export const studentAuthMiddleware = (req: AuthenticatedStudentRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization || (req.headers['x-student-phone'] as string);

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to your student account.'
      });
      return;
    }

    // Support Bearer token or plain student ID / phone header
    let identifier = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    // Resolve student account from token/mobile/id
    const student = studentsStore.find(
      s => s.studentId === identifier || s.mobile === identifier || s.mobile.replace(/\s+/g, '') === identifier.replace(/\s+/g, '')
    );

    if (!student || !student.isActive) {
      res.status(403).json({
        success: false,
        message: 'Student account access forbidden or application not found for this mobile number.'
      });
      return;
    }

    // Attach student context to request
    req.studentId = student.studentId;
    req.mobile = student.mobile;

    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid authentication session.' });
  }
};
