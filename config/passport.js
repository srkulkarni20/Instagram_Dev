//where to find token and decode token
const JwtStatergy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const passport = require('passport');
//directly accessing model created
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts={};
//Add these parameters to the object
//get the token from the request header.This below param will have token assigned
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrkey;
//decode the token,the below function will be exported
module.exports = passport =>{
  passport.use(new JwtStatergy(opts,(payload,done)=>{
    User.findById(payload.id)   //chk in mongo db and return user using done
    .then(user=>{
      if(user){
        console.log("hello");
        return done(null,user);
      }
      else{
        return done(null,false); //false user doesnt exists
      }
    })
  }))
}
