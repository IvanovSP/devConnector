const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');

const router = express.Router();

router.get('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    const establishments = await mysql.query(`SELECT educational_establishment.name, educational_establishment.id FROM educational_establishment WHERE name RLIKE '^${name}`);
    return res.json({ establishments });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.post('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    const [isExist] = await mysql.query(`SELECT educational_establishment.id FROM educational_establishment WHERE name = '${name}'`);
    if (isExist) return res.status(409).json({ isExist: 'record already exist' });

    await mysql.query(`INSERT INTO educational_establishment (name) VALUES ('${name}')`);
    const [id] = await mysql.query(`SELECT educational_establishment.id FROM educational_establishment WHERE name = '${name}'`);
    return res.json({ id, establishment: name });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
