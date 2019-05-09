const express = require('express');
const passport = require('passport');
const mysql = require('../../mysql-promise');
const { getUser, getExperience, getEducation, getSocial, getSkills } = require('../../queries/profile/get');
const { updateUser, updateEducation } = require('../../queries/profile/put');

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

router.put('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { handle } = req.user;
    const {
      degree, stydy_field, program_description,
      start_date, end_date, establishment_id, id,
    } = req.body;

    const [isUsersRecord] = await mysql.query(
      `SELECT education.id FROM education WHERE (user_id = '${handle}' AND id = ${id})`,
    );
    if (!isUsersRecord) return res.status(401).json({ accessDenied: 'access denied' });

    await mysql.query(updateEducation({
      degree, stydy_field, program_description,
      start_date, end_date, establishment_id, id,
    }));

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.post('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { handle } = req.user;
    const {
      degree, stydy_field, program_description,
      start_date, end_date, establishment_id,
    } = req.body;

    await mysql.query(
      `INSERT INTO education
        (user_id, establishment_id, degree, stydy_field, program_description, formCell, toCell)
        VALUES (${handle}, ${establishment_id}, ${degree}, ${stydy_field}, ${program_description}, ${start_date}, ${end_date})`,
    );

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.delete('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { handle } = req.user;
    const { id } = req.body;
    await mysql.query(`DELETE FROM education WHERE (id = ${id} AND user_id = ${handle})`);
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});


router.post('/social/:socialId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { socialId } = req.params;
  const { handle: userId } = req.user;

  try {
    const [isExist] = await mysql.query(`SELECT users_social.id FROM users_social WHERE (user_id = ${userId} AND social_id = ${socialId})`);
    if (isExist) return res.status(409).json({ isExist: 'record already exist' });
    await mysql.query(`INSERT INTO users_social (user_id, social_id) VALUES ('${userId}', '${socialId}')`);

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.delete('/social/:socialId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { socialId } = req.params;
  const { handle: userId } = req.user;

  try {
    await mysql.query(`DELETE FROM users_social WHERE (user_id = ${userId} AND social_id = ${socialId})`);
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.post('/skillset/:skillId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { skillId } = req.params;
  const { handle: userId } = req.user;

  try {
    const [isExist] = await mysql.query(`SELECT skillset.id FROM skillset WHERE (user_id = ${userId} AND skill_id = ${skillId})`);
    if (isExist) return res.status(409).json({ isExist: 'record already exist' });
    await mysql.query(`INSERT INTO skillset (user_id, skill_id) VALUES (${userId}, ${skillId})`);

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.delete('/skillset/:skillsId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { skillId } = req.params;
  const { handle: userId } = req.user;

  try {
    await mysql.query(`DELETE FROM skillset WHERE (user_id = ${userId} AND skill_id = ${skillId})`);
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
