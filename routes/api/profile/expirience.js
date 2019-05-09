const passport = require('passport');
const mysql = require('../../../mysql-promise');
const { updateExpirience } = require('../../../queries/profile/put');

module.exports = (router) => {
  router.put('/expirience', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { handle } = req.user;
      const {
        job_title, startedDate, endedDate, work_location, work_descriprion, id,
      } = req.body;

      const [isUsersRecord] = await mysql.query(
        `SELECT expirience.id FROM education WHERE (user_id = ${handle} AND id = ${id})`,
      );
      if (!isUsersRecord) return res.status(401).json({ accessDenied: 'access denied' });

      await mysql.query(updateExpirience({
        job_title, startedDate, endedDate, work_location, work_descriprion, id,
      }));

      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });
};
