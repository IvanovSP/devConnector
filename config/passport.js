const { Strategy: JwtStrategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');
const mysql = require('../mysql-promise');
const { secret } = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, async ({ id }, done) => {
    const [user] = await mysql.query(
      `SELECT handle FROM user WHERE handle = "${id}" LIMIT 1`,
    );
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  }));
};
