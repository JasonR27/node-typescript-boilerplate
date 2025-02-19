import express from 'express';
// import cors from 'cors';
// import session from 'express-session';
import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import jwt from 'jsonwebtoken';
import login from './login';
import posts from './posts';
import users from './users';
import profile from './profiles';
import picture from './pictures';
import like from './likes';
import signup from './signup';
import verifytoken from './verifytoken';
import comments from './comments';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const SECRET_KEY: string = process.env.SUPABASE_JWT_SECRET || 'default_secret_key';

if (!SECRET_KEY) {
  // console.log('No Secret Key');
} else {
  // console.log('index.ts SECRET_KEY/JWT secret: ', SECRET_KEY);
}

// Creating the session // JWT is normallu use for serverless web apps
// app.use(session({
//   secret: SECRET_KEY,
//   cookie: {
//     httpOnly: true,
//     sameSite: 'strict',
//     secure: false, // Change to true if using HTTPS in production
//     maxAge: 3600 * 10000, // Adjust the maxAge as needed
//   },
// }));

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

// app.get('/corserrorsapp', async (req, res) => {
//   // console.log('entered CorsErrors endpoint');
//   const token = jwt.sign({ id: 'user.id', email: 'user.email' }, SECRET_KEY, { expiresIn: '1h' });
//   req.session.token = token;
//   res.json({ user: { id: 'user.id ljsdlksjf', email: 'user.email: email@email.com', role: req.session.token } });  
// });


// app.get('/corserrorsapplogin', async (req, res) => {
//   // console.log('entered get CorsErrors endpoint');
//   const token = jwt.sign({ id: 'user.id', email: 'user.email' }, SECRET_KEY, { expiresIn: '1h' });
//   req.session.token = token;
//   res.json({ user: { id: 'user.id ljsdlksjf', email: 'user.email: email@email.com', role: req.session.token } });  
// });

// app.post('/corserrorsapplogin', async (req, res) => {
//   // console.log('entered post CorsErrors endpoint');
//   const token = jwt.sign({ id: 'user.id', email: 'user.email' }, SECRET_KEY, { expiresIn: '1h' });
//   req.session.token = token;
//   res.json({ user: { id: 'user.id ljsdlksjf', email: 'user.email: email@email.com', role: req.session.token } });  
// });

app.use('/emojis', emojis);
app.use('/users', users);
app.use('/posts', posts);
app.use('/profiles', profile);
app.use('/pictures', picture);
app.use('/likes', like);
app.use('/comments', comments);
app.use('/auth', signup, login, verifytoken);

export default app;
