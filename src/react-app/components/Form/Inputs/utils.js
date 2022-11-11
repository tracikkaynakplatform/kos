export const getField = (x, field, defaultField = x) =>
  typeof x === 'object' ? (x[field] ? x[field] : defaultField) : x;
