const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require('passport');
const app = express();

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

//Body parser config
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//passport config
app.use(passport.initialize());
require('./config/passport')(passport);



//Db config
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDb connected'))
  .catch(err => console.log(err));
  
//First route
app.get('/', (req, res) => res.send('Hello World'));
app.use('/api/users', users);
app.use('/api/profile', profile);


const port = 9900;
app.listen(port, () => console.log(`Server running on port ${port}`));