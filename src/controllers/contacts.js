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
  const payload = { ...req.body, userId: req.user.id };
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

  const updatedContactResult = await updateContact(contactId, req.body, userId);

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
  const deletedContact = await deleteContact(contactId, userId);

  if (deletedContact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  resp.status(204).end();
}
