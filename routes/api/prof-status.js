const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');

const router = express.Router();

router.get('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    const companies = await mysql.query(`SELECT prof_status.id, prof_status.name FROM company WHERE name RLIKE '^${name}'`);
    return res.json({ companies });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.post('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    const [isExist] = await mysql.query(`SELECT prof_status.id FROM company WHERE name = '${name}'`);
    if (isExist) return res.status(409).json({ isExist: 'record already exist' });

    await mysql.query(`INSERT INTO prof_status (name) VALUES ('${name}')`);
    const [id] = await mysql.query(`SELECT company.id FROM company WHERE name = ${name}`);
    return res.json({ id, status: name });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});
