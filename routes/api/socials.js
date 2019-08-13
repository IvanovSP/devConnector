const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const socials = await mysql.query('SELECT * FROM social_network;');
    return res.json({ socials });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
