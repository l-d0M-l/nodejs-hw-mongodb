import { ContactsCollection } from '../models/contacts.js';

export const getAllContacts = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
  userId,
) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const allContacts = ContactsCollection.find({ userId });

  if (typeof filters.type !== 'undefined') {
    allContacts.where('contactType').equals(filters.type);
  }
  if (typeof filters.isFavourite !== 'undefined') {
    allContacts.where('isFavourite').equals(filters.isFavourite);
  }

  const [contactsTotal, contacts] = await Promise.all([
    ContactsCollection.find({ userId }),
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

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = ContactsCollection.create(payload);
  // console.log(`payloader`, payload);
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const deletedContact = ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return deletedContact;
};
