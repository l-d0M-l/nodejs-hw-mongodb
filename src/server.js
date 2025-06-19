import express from 'express';
import path from 'node:path';

import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';

import contactsRoutes from './routers/contacts.js';
import authRoutes from './routers/auth.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';


const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  //uploading of photos
  app.use('/uploads', express.static(path.resolve('src', 'uploads', 'photos')));

  //api docs
  app.use('/api-docs', swaggerDocs());
  //parsing cookies
  app.use(cookieParser());

  //for contacts
  app.use('/contacts', authenticate, contactsRoutes);

  //for auth
  app.use('/auth', authRoutes);

  //handler for not found errors
  app.use(notFoundHandler);

  //handler for application errors
  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw new Error(error);
    }

    console.log(`Server is running on port ${PORT}`);
  });
};
