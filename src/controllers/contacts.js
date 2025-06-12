import * as fs from 'node:fs/promises';
import path from 'node:path';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
export async function getContactsController(req, resp) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filters = parseFilterParams(req.query);
  const userId = req.user.id;
  // console.log(`contact controller userid`, userId);

  const contacts = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
    userId,
  );

  //extra check if there are no countacts for the user
  if (contacts.totalItems === 0) {
    throw new createHttpError(404, 'Contacts not found');
  }

  resp.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
  // resp.json(contacts);
}

export async function getContactByIdController(req, resp) {
  const contactId = req.params.contactId;
  const userId = req.user.id;
  const dataContact = await getContactById(contactId, userId);

  if (dataContact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  resp.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: dataContact,
  });
}

export async function createContactController(req, resp) {
  let photo;

  if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);

    photo = result.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src', 'uploads', 'photos', req.file.filename),
    );

    photo = `http://localhost:3000/uploads/${req.file.filename}`;
  }

  const payload = { ...req.body, userId: req.user.id, photo };

  // console.log(`controller payload`, payload);
  const newContact = await createContact(payload);

  resp.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

export async function updateContactController(req, resp) {
  const contactId = req.params.contactId;
  const userId = req.user.id;
  let photo;

  if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);

    photo = result.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src', 'uploads', 'photos', req.file.filename),
    );

    photo = `http://localhost:3000/uploads/${req.file.filename}`;
  }

  const updatedContactResult = await updateContact(
    contactId,
    { ...req.body, photo },
    userId,
  );

  if (updatedContactResult === null) {
    throw new createHttpError(404, 'Contact not found');
  }
  resp.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContactResult,
  });
}

export async function deleteContactController(req, resp) {
  const contactId = req.params.contactId;
  const userId = req.user.id;
  console.log('HELLO WORLDD!!!!!!!!!!!1');
  const deletedContact = await deleteContact(contactId, userId);

  if (deletedContact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  resp.status(204).end();
}
