import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import api from './routes';
// import MessageResponse from './interfaces/MessageResponse';
// import * as middlewares from './middleware/errors.ts';


import { notFound, errorHandler } from './middleware/errors';
// import { notFound, errorHandler } from './middleware';
// import cookieParser from ''
import cookieParser from 'cookie-parser';
// import { MessageResponse } from '../types/types';

// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config()

const app = express();

app.use(cookieParser());

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request app.ts: ${req.method} ${req.url}`);
  // console.log('CORS Headers:', res.getHeaders());
  next();
});

// we don't really need this if we are going to run the whole app in services in container within
// the same docker network, but in you want to run frontend, api and db locally you'll need this
// cors setting for security

const corsOptions = {
  origin: ['http://localhost:3000', 'frontend:3000', '127.0.0.1:3008', 'http://localhost:3008', 'api:8080', 'http://api:8080'],
  allowedHeaders: 'Content-Type,Authorization',
  methods: 'POST,GET,HEAD,PUT,PATCH,DELETE,OPTIONS', // Ensure OPTIONS is included
  credentials: true,
};

// Apply CORS middleware before any routes
app.use(cors(corsOptions));

// app.options('*', cors(corsOptions)); // Handle preflight requests for all routes

app.get<object, MessageResponse>('/', (req, res) => {
  if (req) {
    console.log('got a request');
  }
  res.json({
    message: 'Hello! 🚀🦄🌈✨👋🌎✨🌈🦄🚀',
  });
});

app.get<object, MessageResponse>('/backend', (req, res) => {
  if (req) {
    console.log('got a request');
  }
  res.json({
    message: 'Hello extra / backend! 🚀🦄🌈✨👋🌎✨🌈🦄🚀',
  });
});

app.use('/api/v2', api);
// app.use('/backend/api/v2', api);

app.use(notFound);
app.use(errorHandler);

export default app;
