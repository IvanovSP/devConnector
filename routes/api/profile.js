const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');
const profileFieldsToParse = require('../../constants/profileFields');
const { getUser, getExperience, getEducation, getSocial, getSkills } = require('../../queries/profile/get');

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


router.post('/:userId/social/:socialId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { userId, socialId } = req.params;
  try {
    const [isExist] = await mysql.query(`SELECT users_social.id FROM users_social WHERE (user_id = '${userId}' AND social_id = '${socialId}')`);
    if (isExist) return res.status(409).json({ isExist: 'record already exist' });

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
