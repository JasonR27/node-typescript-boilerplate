 import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config'; // Make sure your secret key is imported here
import { PrismaClient } from '@prisma/client';

const SECRET_KEY: string = process.env.SUPABASE_JWT_SECRET || 'default_secret_key';

if (!SECRET_KEY) {
  // console.log('No Secret Key');
} else {
  // console.log('login endpoint SECRET_KEY/JWT secret: ', SECRET_KEY);
}

const prisma = new PrismaClient();

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password (you should use a more secure method here, e.g., bcrypt)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email }, SECRET_KEY, { expiresIn: '1h' });

    if (token) {
      console.log('Generated token for user ID:', user.id);
      console.log('Token: ', token);
    }
    console.log('after token sing in lines');

    try {

      console.log('New session generated successfully:');

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // if true then cookie is only send through https
        sameSite: 'strict',
        maxAge: 3600 * 10000, // 1 hour in milliseconds
      }).send({ user: { id: user.id, email: user.email, role: user.role }, redirectUrl: '/myprofiles' });

    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'An error occurred while logging in.' });
    }

  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).json({ error: 'An error occurred while processing the login request.' });
  }
};

export default loginUser;