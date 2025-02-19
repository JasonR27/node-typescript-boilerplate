import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/profiles', async (req, res) => {
  const users = await prisma.profiles.findMany();
  res.json('hello');
  res.json(users);
});

export default router;
