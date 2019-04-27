const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');

const router = express.Router();

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const [establishment] = await mysql.query(`SELECT educational_establishment.name FROM educational_establishment WHERE id = ${id}`);
    return res.json({ id, establishment });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.post('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    // INSERT INTO company (name, website) VALUES
    await mysql.query(`INSERT INTO educational_establishment (name) VALUES ('${name}')`);
    const [id] = await mysql.query(`SELECT educational_establishment.id FROM educational_establishment WHERE name = ${name}`);
    return res.json({ id, establishment: name });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    await mysql.query(`DELETE FROM educational_establishment WHERE id=${id}`);
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});
