const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../models/User');
const keys = require('../../config/keys');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  if(!(req.body.email))
{
  return res.status(400).json({msg :'Email Field required'});
}
if(!(req.body.password))
{
  return res.status(400).json({msg :'Password Required'});
}
if(!(req.body.name))
{
  return res.status(400).json({msg :'Name Required'});
}
var valid = validator.validate(req.body.email);
if(!valid)
{
  return res.status(400).json({email: 'Email Not Valid'});
}
  User.findOne({email: req.body.email })
    .then(user => {
      if (user){
        return res.status(400).json({email: 'Email already exists'});
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        });

      }
    })
    .catch(err => console.log(err));
});


// @route   POST api/users/login
// @desc    Login user / return JWT token
// @access  Public
router.post('/login', (req, res) => {
  if(!(req.body.email))
{
  return res.status(400).json({msg :'Email Field required'});
}
if(!(req.body.password))
{
  return res.status(400).json({msg :'Password Required'});
}

  User.findOne({email: req.body.email})
    .then(user => {
      if (!user){
        return res.status(404).json({email: 'User not found'});
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then(isMatch => {
            if (isMatch){
              const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar
              };

              //sign token
              jwt.sign(
                payload, 
                keys.secretOrkey,
                {expiresIn: 3600},
                (err, token) => {
                  return res.json({token: 'Bearer ' + token+keys.secretOrKey}
                  )
                }
                );

            } else {
              return res.status(400).json({password: 'Invalid password'});
            }
          });
      }
    })
    .catch(err => console.log(err));
})


module.exports = router;
