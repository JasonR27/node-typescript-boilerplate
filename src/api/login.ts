

// import express from 'express';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
// import session from 'express-session';
import { auth } from '../middleware/auth';
// import cookie from 'cookie';
import cookieParser from 'cookie-parser';
// import cors from 'cors';

dotenv.config();

const router = express.Router();

router.use(cookieParser());

const prisma = new PrismaClient();

router.use(bodyParser.json());

const SECRET_KEY: string = process.env.SUPABASE_JWT_SECRET || 'default_secret_key';

if (!SECRET_KEY) {
  // console.log('No Secret Key');
} else {
  // console.log('login endpoint SECRET_KEY/JWT secret: ', SECRET_KEY);
}

// import { randomBytes } from 'crypto';

// const generateSecret = () => {
//   return randomBytes(32).toString('hex'); // Generates a 64-character hexadecimal string
// };



router.post('/login', async (req, res): Promise<any> => {
  
  console.log('Entered login endpoint');
  const { email, password } = req.body;
  // console.log('email: ', email);

  const user = await prisma.users.findUnique({ where: { email: email } });

  if (user && await bcrypt.compare(password, user.passwordHash)) {
    // Ensure the user ID is unique
    // const generatedSecret = generateSecret();
    // console.log('process.env.SUPABASE_JWT_SECRET: ', process.env.SUPABASE_JWT_SECRET);
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    if (token) {
      console.log('Generated token for user ID:', user.id);
      console.log('token: ', token);
    }
    console.log('after token sing in lines');

    try {

      console.log('New session generated succesfully:');

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // if true then cookie is only send through https
        sameSite: 'strict',
        maxAge: 3600 * 10000, // 1 hour in milliseconds
      }).send({ user: { id: user.id, email: user.email, role: user.role }, redirectUrl: '/myprofiles' });

      // }

    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'An error occurred while logging in.' });
    }

    // res.json({
    //   message: 'Login successful',
    //   user: { id: user.id, email: user.email, role: user.role },
    //   redirectUrl: '/myprofiles',
    // });
    
    // console.log('New token assigned successfully');

  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/logout', auth, async (req, res): Promise<any> => {
  // console.log('Entering logout endpoint');
  const { email } = req.body;
  // console.log('email: ', email);

  try {
    // Cleaning session cookies

    res.clearCookie('token'); // Clear specific cookie

    // // console.log('User signed out successfully:', updatedUser);
    // console.log('User  signed out successfully:');
    return res.json({
      redirectUrl: '/profiles',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ error: 'An error occurred while logging out.' });
  }
});


router.get('/userinfo', auth, async (req: Request, res: Response) => {
  console.log('Entered get user info  endpoint');
  const token = req.cookies.token;
  let userId;
  // let userEmail;

  // console.log('user info endpoint token: ', token);

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    // Attach the decoded information to the request object
    userId = decoded.id;
    // userEmail = decoded.email; 
    // console.log('decoded: ', decoded, ' ', 'decoded.id: ', decoded.id, 'decoded.email: ', decoded.email);
    // next(); // Proceed to the next middleware or route handler
  });

  const user = await prisma.users.findUnique({ where: { id: userId } });

  res.json({ user: { email: user?.email, name: user?.name, username: user?.username } });
  
});


export default router; 