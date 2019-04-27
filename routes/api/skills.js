const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');

const router = express.Router();

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const [skill] = await mysql.query(`SELECT skills.name FROM skills WHERE id = ${id}`);
    return res.json({ id, skill });
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
    const [id] = await mysql.query(`SELECT skills.id FROM skills WHERE name = ${name}`);
    return res.json({ id, skill: name });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    await mysql.query(`DELETE FROM skills WHERE id=${id}`);
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});
