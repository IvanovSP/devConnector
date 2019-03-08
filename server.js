const espress = require('express')

const app = espress();

app.get('/', (res) => {
  res.send('hello');
});

const port = process.env.PORT || 5000;
