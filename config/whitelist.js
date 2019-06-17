const whitelist = ['https://localhost:3000'];

module.exports = {
  origin(origin, callback) {
    const isInWhitelist = whitelist.some(domain => domain === origin);
    if (isInWhitelist) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}
