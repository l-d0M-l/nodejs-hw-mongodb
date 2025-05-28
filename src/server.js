import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getEnvVar } from '../utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';
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

  // app.get('/', (req, resp) => {
  //   resp.json({ message: 'hello' });
  // });

  app.get('/contacts', async (req, resp) => {
    const dataContacts = await getAllContacts();
    resp.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: dataContacts,
    });
  });
  app.get('/contacts/:contactId', async (req, resp) => {
    const contactId = req.params.contactId;
    console.log(typeof contactId);

    const dataContact = await getContactById(contactId);

    if (dataContact === null) {
      resp.status(404).json({
        message: 'Contact not found',
      });
      return;
    }
    resp.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: dataContact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, (error) => {
    if (error) {
      throw new Error(error);
    }

    console.log(`Server is running on port ${PORT}`);
  });
};
