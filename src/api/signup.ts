import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import loginUser from '../middleware/loginMiddleware'

dotenv.config();

const SECRET_KEY: string = process.env.SUPABASE_JWT_SECRET || 'default_secret_key';

if (!SECRET_KEY) {
  console.log('No Secret Key');
} else {
  console.log('login endpoint SECRET_KEY/JWT secret: ', SECRET_KEY);
}

// const app = express();
const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 12;

router.use(express.json());

const homeUrl = process.env.HOME_URL;

const BASE_URL = `${homeUrl}/backend`;

const generateSecret = () => {
  return randomBytes(32).toString('hex'); // Generates a 64-character hexadecimal string
};

const generatedSecret = generateSecret();

router.post('/signup', async (req, res): Promise<any> => {
  console.log('Its entering router.post /signup endpoint test');

  const { email, password, username, name } = req.body;

  console.log(req.body)

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    console.log('entered try block')
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({ // if you want to store the new user in a variable

    // await prisma.users.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        username: username,
        name: name,
        role: '',
      },
    });

    if (newUser) {
      console.log('User succesfully created')
    } else {
      console.log('failed to create user')
    }

    // // logging to confirm address for fetch request

    // console.log(`Attempting to log in with email: ${email} and password: ${password}`);
    // console.log(`${BASE_URL}/api/v2/auth/login`);

    // // Call the login endpoint with the new user's credentials
    // const loginResponse = await fetch(`${BASE_URL}/api/v2/auth/login`, {
    // // const loginResponse = await fetch(`http://localhost:3008/backend/api/v2/auth/login`, {
    //   // const loginResponse = await fetch(`http://api:8080/api/v2/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });

    // // const loginData = await loginResponse.json();
    // // newUser.token = loginData.token;

    // console.log('signup endpoint logging user in');

    // if (loginResponse.ok) {
    //   return res.status(201).json({ redirectUrl: '/myprofiles' });
    // } else {
    //   return res.status(401).json({ error: 'Login failed after signup' });
    // }

    // return res.status(201).json({ message: 'User created successfully', user: newUser });

    // const loginResult = await loginUser(email, password);

    // req.body = { email, password };
    
    // const loginResult = await loginUser(req, res);

    // if (loginResult.error) {
    //   // return res.status(401).json(loginResult);
    // } else {
    //   // return res.redirect('/login');
    // }

    const user = await prisma.users.findUnique({ where: { email: email } });
    
      if (user) {
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


    
  }} catch (error: any) {
    console.log('error name: ', error.name);
    console.log('error message:', error.message)
    console.log('error stack:', error.stack)
    console.log('error code:', error.code)
    console.log('error cause:', error.cause)
    console.log('error arguments:', error.arguments)
    console.log('before console.error')
    console.error
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    // res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
