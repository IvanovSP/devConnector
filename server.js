const exspress = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mysql = require('./mysql-promise');
const { host, user, password, database } = require('./config/keys');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = exspress();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mysql.connect({ host, user, password, database });

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
