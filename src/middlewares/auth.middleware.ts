import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TokenPayload } from '../types/type';

const secretKey: string = `${process.env.SECRET_KEY}`;

//middleware to authenticate valid JWT token
export const authenticateJwt: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Unauthorized: Token not provided or invalid' });
    return;
  }
  expressjwt({
    secret: secretKey,
    algorithms: ['HS256'],
  })(req, res, next);
};

// middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.auth!.role;
  if (userRole === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'You do not have permission to perform this action.' });
  }
};

//middleware to generate JWT token
export const generateToken = (userData: TokenPayload): string => {
  return jwt.sign(userData, secretKey, { expiresIn: '1h' });
};