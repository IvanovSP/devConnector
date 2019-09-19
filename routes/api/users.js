const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { promisfy } = require('promisfy');
const mysql = require('../../mysql-promise');
const { secret } = require('../../config/keys');
const validateRegister = require('../../validation/register');

const router = express.Router();

const sign = promisfy(jwt.sign);

// @route     GET api/users/register
// @desc      Register User
// @access    Public
router.post('/register', async (req, res) => {
  try {
    const {
      email, name, password,
    } = req.body;

    const { errors, isValid } = validateRegister(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const [emailIsExist] = await mysql.query(
      `SELECT email FROM user WHERE email = "${email}" LIMIT 1`,
    );
    if (emailIsExist) {
      return res.sendStatus(400);
    }

    let idIsExist = true;
    let userId;

    // collision handler
    while (idIsExist) {
      userId = Math.random().toString(36).substr(2, 9);
      [idIsExist] = await mysql.query(
        `SELECT handle FROM user WHERE handle = "${userId}" LIMIT 1`,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    await mysql.query(
      'INSERT INTO user (handle, name, email, password) VALUES ?',
      [
        [userId, name, email, passwordHashed],
      ],
    );
    return res.json({ userId });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});


// @route     GET api/users/login
// @desc      Login User / Returning JWT  Token
// @access    Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);

  try {
    const [user] = await mysql.query(
      `SELECT password, handle, email, name FROM user WHERE email = "${email}" LIMIT 1`,
    );
    if (!user) {
      return res.sendStatus(401);
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (passwordIsMatch) {
      const payload = { name: user.name, email: user.email, id: user.handle };
      const token = await sign(payload, secret, { expiresIn: 3600 });
      return res.json({ token: `Bearer ${token}` });
    } else {
      return res.sendStatus(401);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});


// @route     GET api/users/:username
// @desc      Return current user
// @access    Private
router.get('/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { username } = req.params;
  try {
    const users = await mysql.query(`SELECT user.handle, user.name, user.avatar, user.profession, user.city FROM user WHERE name RLIKE '^${username}'`);
    res.json(users);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});


module.exports = router;
