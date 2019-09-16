const mysql = require('mysql');

const mysqlPromise = {
  connect({
    host, user, password, database,
  }) {
    this.con = mysql.createConnection({
      host,
      user,
      password,
      database,
    });

    return new Promise((resolve, reject) => {
      this.con.connect(err => (err ? reject(err) : resolve(console.log('Connected!'))));
    });
  },

  query(query, data = []) {
    if (!this.con) {
      throw new Error('No connection established.');
    }

    return new Promise((resolve, reject) => {
      this.con.query(query, data, (err, rows) => (err ? reject(err) : resolve(rows)));
    });
  },
}

module.exports = mysqlPromise;
