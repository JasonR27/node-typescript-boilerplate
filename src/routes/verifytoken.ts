import express from 'express';
// import bcrypt from 'bcrypt';
import jwt, { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
// const cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
// import 'express-session';

import prisma from '../lib/prisma';
// import session from 'express-session';
dotenv.config();



const router = express();
// const prisma = new PrismaClient();
router.use(bodyParser.json());
router.use(cookieParser()); // For parsing cookies


// const SECRET_KEY: string = process.env.REACT_APP_SUPABASE_JWT_SECRET || 'default_secret_key';

router.get('/verifytoken', async (req, res): Promise<any> => {
  console.log('Entered verify token endpoint - testing 1');
  const token = req.cookies.token;

  console.log('Extracted token: ', token);

  if (!token) {
    console.log('token is undefined');
    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }

  const SECRET_KEY: string = process.env.SUPABASE_JWT_SECRET || 'default_secret_key';

  if (!SECRET_KEY) {
    console.log('No Secret Key');
  } else {
    console.log('verify token endpoint SECRET_KEY: ', SECRET_KEY);
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Ensure SECRET_KEY is correct
    console.log('verifytoken endpoint Token is valid, decoded token: ', decoded);
    
    return res.json({ valid: true });
  } catch (error) {
    console.error('Token verification error: ', error);
    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});


export default router;
