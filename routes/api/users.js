const express = require('express');
const bcript = require('bcryptjs');
const mysql = require('../../mysql-promise');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const {
      email, name, profStatus, currentCompany, city, github, bio, password,
    } = req.body;
    console.log(email, name, password);

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

    const salt = await bcript.genSalt(10);
    const passwordHashed = await bcript.hash(password, salt);

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

module.exports = router;
