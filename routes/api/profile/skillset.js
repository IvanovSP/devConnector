const passport = require('passport');
const mysql = require('../../../mysql-promise');

module.exports = (router) => {
  router.post('/skillset/:skillId?', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { skillId } = req.params;
    const { skillName } = req.body;
    const { handle: userId } = req.user;

    try {
      let newSkillId = '';
      if (skillId) {
        const [isExist] = await mysql.query('SELECT skillset.id FROM skillset WHERE (user_id = ? AND skill_id = ?)', [userId, skillId]);
        if (isExist) return res.status(409).json({ isExist: 'record already exist' });
      } else {
        await mysql.query(`INSERT INTO skills (name) VALUES ('${skillName}')`);
        [{ id: newSkillId }] = (await mysql.query(`SELECT skills.id FROM skills WHERE name = '${skillName}'`));
      }

      await mysql.query('INSERT INTO skillset (user_id, skill_id) VALUES (? , ?)', [userId, (skillId || newSkillId)]);
      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });

  router.delete('/skillset/:skillId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { skillId } = req.params;
    const { handle: userId } = req.user;

    try {
      await mysql.query('DELETE FROM skillset WHERE (user_id = ? AND skill_id = ?)', [userId, skillId]);
      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });
};
