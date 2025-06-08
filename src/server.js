import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';

import contactsRoutes from './routers/contacts.js';
import authRoutes from './routers/auth.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

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

  //parsing cookies
  app.use(cookieParser());

  //for contacts
  app.use('/contacts', contactsRoutes);

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
