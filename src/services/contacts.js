import { ContactsCollection } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const student = await ContactsCollection.findById(contactId);
  return student;
};
