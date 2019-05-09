const passport = require('passport');
const mysql = require('../../../mysql-promise');
const { updateEducation } = require('../../../queries/profile/put');

module.exports = (router) => {
  router.put('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { handle } = req.user;
      const {
        degree, stydy_field, program_description,
        start_date, end_date, establishment_id, id,
      } = req.body;

      const [isUsersRecord] = await mysql.query(
        `SELECT education.id FROM education WHERE (user_id = ${handle} AND id = ${id})`,
      );
      if (!isUsersRecord) return res.status(401).json({ accessDenied: 'access denied' });

      await mysql.query(updateEducation({
        degree, stydy_field, program_description,
        start_date, end_date, establishment_id, id,
      }));

      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });

  router.post('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { handle } = req.user;
      const {
        degree, stydy_field, program_description,
        start_date, end_date, establishment_id,
      } = req.body;

      await mysql.query(
        `INSERT INTO education
        (user_id, establishment_id, degree, stydy_field, program_description, formCell, toCell)
        VALUES (${handle}, ${establishment_id}, ${degree}, ${stydy_field}, ${program_description}, ${start_date}, ${end_date})`,
      );

      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });

  router.delete('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { handle } = req.user;
      const { id } = req.body;
      await mysql.query(`DELETE FROM education WHERE (id = ${id} AND user_id = ${handle})`);
      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });
};
