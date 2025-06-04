const parseNumber = (value, defaultValue) => {
  if (typeof value === 'undefined') return defaultValue;

  const parsedValue = parseInt(value);

  if (Number.isNaN(parsedValue)) {
    return defaultValue;
  }
  return parsedValue;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page);
  const parsedPerPage = parseNumber(perPage);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
