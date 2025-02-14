// import express from 'express';
// // import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// // import { PrismaClient } from '@prisma/client';
// import bodyParser from 'body-parser';
// import * as dotenv from 'dotenv';
// import 'express-session';
// // import session from 'express-session';
// dotenv.config();

// // const SECRET_KEY: string | undefined = process.env.VITE_SUPABASE_JWT_SECRET;

// const SECRET_KEY: string | undefined = process.env.VITE_SUPABASE_JWT_SECRET || 'default_secret_key';

// declare module 'express-session' {
//   interface SessionData {
//     user: { [key: string]: any };
//     token: string;
//   }
// }


// const router = express();
// // const prisma = new PrismaClient();
// router.use(bodyParser.json());

// declare module 'express-session' {
//   interface SessionData {
//     user: { [key: string]: any };
//     token: string;
//   }
//   interface SessionOptions {
//     user: IUser
//   }  
// }

// router.post('/createsession', (req, res) => {
//   const { token, user } = req.body;

//   router.use(session({
//     secret: token, // Change this to your own secret
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//     user: user,
//     // token: token,
//   }));

    
// });
  
// export default router;