const passport = require('passport');
const mysql = require('../../../mysql-promise');
const { updateExpirience } = require('../../../queries/profile/put');

module.exports = (router) => {
  router.put('/expirience', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const {
        job_title, startedDate, endedDate, work_location, work_descriprion, id, company_name,
      } = req.body;

      let [[professionIsExist], [{ id: company_id }]] = await Promise.all([
        await mysql.query(
          `SELECT profession.name FROM profession WHERE (name = '${job_title}');`,
        ),
        await mysql.query(
          `SELECT company.id FROM company WHERE (name = '${company_name}');`,
        ),
      ]);

      await Promise.all([
        (async () => {
          if (professionIsExist) return;
          await mysql.query(`INSERT INTO profession (name) VALUES ('${job_title}')`);
        })(),
        (async () => {
          if (company_id) return;
          await mysql.query(`INSERT INTO company (name) VALUES ('${company_name}')`);
          [{ id: company_id }] = await mysql.query(
            `SELECT company.id FROM company WHERE (name = '${company_name}');`,
          );
        })(),
      ]);

      await mysql.query(updateExpirience({
        job_title, startedDate, endedDate, work_location, work_descriprion, id, company_id,
      }));

      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });

  router.post('/expirience', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { handle } = req.user;
      const {
        job_title, startedDate, endedDate, work_location, work_descriprion, company_name,
      } = req.body;

      let [[professionIsExist], [{ id: company_id }]] = await Promise.all([
        await mysql.query(
          `SELECT profession.name FROM profession WHERE (name = '${job_title}');`,
        ),
        await mysql.query(
          `SELECT company.id FROM company WHERE (name = '${company_name}');`,
        ),
      ]);
      console.log(company_id);

      await Promise.all([
        (async () => {
          if (professionIsExist) return;
          await mysql.query(`INSERT INTO profession (name) VALUES ('${job_title}')`);
        })(),
        (async () => {
          if (company_id) return;
          await mysql.query(`INSERT INTO company (name) VALUES ('${company_name}')`);
          [{ id: company_id }] = await mysql.query(
            `SELECT company.id FROM company WHERE (name = '${company_name}');`,
          );
        })(),
      ]);

      await mysql.query(
        `INSERT INTO expirience
        (title, fromCell, toCell, city, description, company_id, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [job_title, startedDate, endedDate, work_location, work_descriprion, company_id, handle],
      );

      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });

  router.delete('/expirience', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { handle } = req.user;
      const { id } = req.body;
      await mysql.query('DELETE FROM expirience WHERE (id = ? AND user_id = ?)', [id, handle]);
      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });
};
