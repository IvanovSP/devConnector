const exspress = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const mysql = require('./mysql-promise');
const { host, user, password, database } = require('./config/keys');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const company = require('./routes/api/company');
const skills = require('./routes/api/skills');
const profStatus = require('./routes/api/prof-status');
const educationalEstablishment = require('./routes/api/educational-establishment');

const corsOptions = require('./config/whitelist');

const app = exspress();

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mysql.connect({ host, user, password, database });

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/company', company);
app.use('/api/skills', skills);
app.use('/api/prof-status', profStatus);
app.use('/api/educational-establishment', educationalEstablishment);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
