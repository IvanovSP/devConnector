const express = require('express');
const passport = require('passport');
const mysql = require('../../../mysql-promise');
const {
  getUser, getExperience, getEducation, getSocial, getSkills,
} = require('../../../queries/profile/get');
const { updateUser } = require('../../../queries/profile/put');

const router = express.Router();

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

router.put('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { handle } = req.user;

    const {
      city, github_username, bio, email, prof_status_id, company_id, user_name,
    } = req.body;

    const [emailIsExist] = await mysql.query(
      `SELECT user.handle FROM user WHERE (email = '${email}' AND handle != ${handle})`,
    );
    if (emailIsExist) return res.status(409).json({ isExist: 'email already exist' });

    await mysql.query(updateUser({
      city, github_username, bio, email, prof_status_id, company_id, user_name, handle,
    }));

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

require('./education')(router);
require('./expirience')(router);
require('./social')(router);
require('./skillset')(router);

module.exports = router;
