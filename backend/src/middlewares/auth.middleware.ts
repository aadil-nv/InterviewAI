import { RequestHandler, Response, NextFunction } from "express";
import { verifyAccessToken } from '../utils/jwt';
import { HttpStatusCode } from '../constants/http-status-code.enum';
import { AuthRequest } from '../interfaces/authRequest.interface';

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const authReq = req as unknown as AuthRequest;

    const token = authReq.cookies?.accessToken;
    if (!token) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = verifyAccessToken(token);
    authReq.user = decoded;

    next();
  } catch (err) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};
