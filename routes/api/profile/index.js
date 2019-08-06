const express = require('express');
const request = require('request');
const passport = require('passport');
const { gitClientID, gitClientSecret } = require('../../../config/keys');
const mysql = require('../../../mysql-promise');
const {
  getUser, getExperience, getEducation, getSocial, getSkills,
} = require('../../../queries/profile/get');
const { updateUser } = require('../../../queries/profile/put');

const router = express.Router();

router.get('/:handle?', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const handle = req.params.handle || req.user.handle;
    const [[user], experience, education, social, skills] = await Promise.all([
      await mysql.query(getUser(handle)),
      await mysql.query(getExperience(handle)),
      await mysql.query(getEducation(handle)),
      await mysql.query(getSocial(handle)),
      await mysql.query(getSkills(handle)),
    ]);
    if (!user) {
      return res.status(404).json({ msg: 'No such user found' });
    }
    const profileToSend = {
      ...user, experience, education, social, skills,
    };
    return res.json(profileToSend);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${gitClientID}&client_secret=${gitClientSecret}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { handle } = req.user;

    const {
      city, github_username, bio, email, profession, company_id, user_name,
    } = req.body;

    const [emailIsExist] = await mysql.query(
      `SELECT user.handle FROM user WHERE (email = '${email}' AND handle != ${handle})`,
    );
    if (emailIsExist) return res.status(409).json({ isExist: 'email already exist' });

    await mysql.query(updateUser({
      city, github_username, bio, email, profession, company_id, user_name, handle,
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
