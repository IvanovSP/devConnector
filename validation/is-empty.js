module.exports = value => (
  value === undefined ||
  value === null ||
  (value.constructor === Object && !Object.keys(value).length) ||
  (Array.isArray(value) && !value.length) ||
  (typeof value === 'string' && !value.trim().length)
);
