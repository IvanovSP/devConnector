const espress = require('express');

const mysql = require('./mysql-promise');

const app = espress();

const db = require('./config/keys');

mysql.connect(db);

app.get('/', (res) => {
  res.send('hello');
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))
