const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');
const profileFieldsToParse = require('../../constants/profileFields');

const router = express.Router();

// @route     GET api/profile
// @desc      Get current user profile
// @access    Private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {};
  try {
    const [profile] = await mysql.query(
      `SELECT * FROM user WHERE handle = "${req.user.handle}" LIMIT 1`,
    );
    if (!profile) {
      errors.noprofiles = 'No user found';
      return res.status(404).json(errors);
    }
    const { password, ...profileToSend } = profile;
    return res.json(profileToSend);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

// @route     POST api/profile
// @desc      update user profile
// @access    Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const profileFields = {};
  try {
    profileFieldsToParse.forEach((val, key) => {
      profileFields[key] = val || null;
    });
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
