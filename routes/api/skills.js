const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');

const router = express.Router();

router.get('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    const skills = await mysql.query(`SELECT skills.id, skills.name FROM skills WHERE name RLIKE '^${name}'`);
    return res.json({ skills });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.post('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    // INSERT INTO company (name, website) VALUES
    await mysql.query(`INSERT INTO skills (name) VALUES ('${name}')`);
    const [id] = await mysql.query(`SELECT skills.id FROM skills WHERE name = '${name}'`);
    return res.json({ id, skill: name });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});
