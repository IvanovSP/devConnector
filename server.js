const exspress = require('express');
const mysql = require('./mysql-promise');
const db = require('./config/keys');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = exspress();
mysql.connect(db);

app.get('/', (res) => {
  res.send('hello');
});

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
