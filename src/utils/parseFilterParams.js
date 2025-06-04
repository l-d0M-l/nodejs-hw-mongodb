const parseFavourite = (value) => {
  if (typeof value !== 'string') return undefined;

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  return;
};

const parseContactType = (value) => {
  if (typeof value !== 'string') return undefined;

  const keys = ['work', 'home', 'personal'];

  if (keys.includes(value)) {
    return value;
  }

  return;
};
export const parseFilterParams = (query) => {
  const { isFavourite, contactType } = query;
  const parsedFavourite = parseFavourite(isFavourite);
  const parsedContactType = parseContactType(contactType);

  return {
    isFavourite: parsedFavourite,
    type: parsedContactType,
  };
};
