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
  // console.log(sortBy, sortOrder); good

  const contacts = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
  );
  resp.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
  // resp.json(contacts);
}

export async function getContactByIdController(req, resp) {
  const contactId = req.params.contactId;

  const dataContact = await getContactById(contactId);

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
  const newContact = await createContact(req.body);

  resp.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

export async function updateContactController(req, resp) {
  const contactId = req.params.contactId;

  const updatedContactResult = await updateContact(contactId, req.body);

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
  const deletedContact = await deleteContact(contactId);

  if (deletedContact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  resp.status(204).end();
}
