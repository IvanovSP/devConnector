const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');

const router = express.Router();

router.get('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    const companies = await mysql.query(`SELECT company.id, company.name, company.website FROM company WHERE name RLIKE '^${name}'`);
    return res.json({ companies });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.post('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name, website } = req.params;
    // INSERT INTO company (name, website) VALUES
    await mysql.query(`INSERT INTO company (name, website) VALUES ('${name}', '${website}')`);
    const [id] = await mysql.query(`SELECT company.id FROM company WHERE name = ${name}`);
    return res.json({ id, company: name, website });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});
