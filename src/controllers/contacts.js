import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export async function getContactsController(req, resp) {
  const dataContacts = await getAllContacts();
  resp.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: dataContacts,
  });
}

export async function getContactByIdController(req, resp) {
  const contactId = req.params.contactId;

  const dataContact = await getContactById(contactId);

  if (dataContact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  resp.json({ data: dataContact });
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
  const deletedContact = deleteContact(contactId);

  if (deletedContact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  resp.status(204).end();
}
