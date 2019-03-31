const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { promisfy } = require('promisfy');
const mysql = require('../../mysql-promise');
const { secret } = require('../../config/keys');

const router = express.Router();

const sign = promisfy(jwt.sign);

// @route     GET api/users/register
// @desc      Register User
// @access    Public
router.post('/register', async (req, res) => {
  try {
    const {
      email, name, profStatus, currentCompany, city, github, bio, password,
    } = req.body;

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
      'INSERT INTO user (handle, name, prof_status_id, current_company_id, city, github_username, bio, email, password) VALUES ?',
      [
        [userId, name, profStatus, currentCompany, city, github, bio, email, passwordHashed],
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

  try {
    const [user] = await mysql.query(
      `SELECT password, handle, email, name FROM user WHERE email = "${email}" LIMIT 1`,
    );
    if (!user) {
      return res.sendStatus(404).json({ email: 'User not found' });
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (passwordIsMatch) {
      const payload = { name: user.name, email: user.email, id: user.handle };
      const token = await sign(payload, secret, { expiresIn: 3600 });
      res.json({ token: `Bearer ${token}` });
    } else {
      return res.sendStatus(400).json({ password: 'Password incorrect' });
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});


// @route     GET api/users/current
// @desc      Return current user
// @access    Private
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    res.json(req.user);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});


module.exports = router;
