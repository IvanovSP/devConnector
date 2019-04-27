const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');
const profileFieldsToParse = require('../../constants/profileFields');
const { getUser, getExperience, getEducation, getSocial, getSkills } = require('../../queries/profile/get/index');

const router = express.Router();

// @route     GET api/profile
// @desc      Get current user profile
// @access    Private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const [user, experience, education, social, skills] = await Promise.all([
      await mysql.query(getUser(req.user.handle)),
      await mysql.query(getExperience(req.user.handle)),
      await mysql.query(getEducation(req.user.handle)),
      await mysql.query(getSocial(req.user.handle)),
      await mysql.query(getSkills(req.user.handle)),
    ]);
    const profileToSend = {
      ...user, experience, education, social, skills,
    };
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
  const {
    email, name, password,
  } = req.body;
  try {
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
