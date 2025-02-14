import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY: string = process.env.SUPABASE_JWT_SECRET || 'default_secret_key';

// if (!SECRET_KEY) {
//   console.log('No Secret Key');
// } else {
//   console.log('middleware auth SECRET_KEY/JWT secret: ', SECRET_KEY);
// }

// Middleware function to verify JWT
export const auth = (req: Request, res: Response, next: NextFunction) => {
  // Parse cookies
  cookieParser()(req, res, () => {
    // Get the token from the cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (token) {
      // console.log('token: ', token);
      // Verify the token
      // console.log('SECRET_KEY used in auth: ', SECRET_KEY);
      jwt.verify(token, SECRET_KEY, (err: jwt.VerifyErrors) => {
        if (err) {
          console.log('token that gave error: ', token);
          return res.status(403).json({ message: 'Forbidden: Invalid token' });
        } else {
          next();
        }
        // Attach the user object to the request object
        // req.user = user;
        
      });
    } else {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
  });
};
