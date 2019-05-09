const passport = require('passport');
const mysql = require('../../../mysql-promise');

module.exports = (router) => {
  router.post('/social/:socialId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { socialId } = req.params;
    const { handle: userId } = req.user;

    try {
      const [isExist] = await mysql.query(`SELECT users_social.id FROM users_social WHERE (user_id = ${userId} AND social_id = ${socialId})`);
      if (isExist) return res.status(409).json({ isExist: 'record already exist' });
      await mysql.query(`INSERT INTO users_social (user_id, social_id) VALUES ('${userId}', '${socialId}')`);

      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });

  router.delete('/social/:socialId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { socialId } = req.params;
    const { handle: userId } = req.user;

    try {
      await mysql.query(`DELETE FROM users_social WHERE (user_id = ${userId} AND social_id = ${socialId})`);
      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });
};