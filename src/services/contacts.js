import { ContactsCollection } from '../models/contacts.js';

export const getAllContacts = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const allContacts = ContactsCollection.find();
  
  if (typeof filters.type !== 'undefined') {
    allContacts.where('contactType').equals(filters.type);
  }
  if (typeof filters.isFavourite !== 'undefined') {
    allContacts.where('isFavourite').equals(filters.isFavourite);
  }

  const [contactsTotal, contacts] = await Promise.all([
    ContactsCollection.find(),
    allContacts
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const totalPages = Math.ceil(contactsTotal.length / perPage);
  const totalItems = contactsTotal.length;
  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const updatedContact = ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    { new: true },
  );
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = ContactsCollection.findByIdAndDelete(contactId);
  return deletedContact;
};
