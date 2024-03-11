import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import { NextFunction } from 'express';

const secretKey = 'giudJD28d28&#*$@dw'; // Replace with your secret key

// Middleware to verify JWT token and attach user data to request object
export const authenticateJwt = expressjwt({
  secret: secretKey,
  algorithms: ['HS256'], // Specify the algorithm used to sign the token
}).unless({
  path: ['/login'], // Add any public routes here that don't require JWT authentication
});

export const isAdmin = (req: any, res: any, next: NextFunction) => {
  // Check if the user has the "admin" role in the decoded JWT token
  console.log("req: ", req.auth);
  const userRole = req.auth.role; // Assuming "role" is included in the JWT payload
  if (userRole === 'admin') {
    // User is an admin, proceed to the next middleware or route handler
    next();
  } else {
    // User is not an admin, return a 403 Forbidden response
    res.status(403).json({ message: 'You do not have permission to perform this action.' });
  }
};

// Function to generate JWT token
export const generateToken = (userData: any): string => {
  return jwt.sign(userData, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
};