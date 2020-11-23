const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");



// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    console.log("hellp");
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
  
  const profileFields = {};
  profileFields.user = req.user.id;
  console.log(req.user.id);
  profileFields.name = req.user.name; 
  if (req.body.username) profileFields.username = req.body.username;
  if (req.body.phone_num) profileFields.company = req.body.phone_num;
  if (req.body.bio) profileFields.bio = req.body.bio;
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  Profile.findOne({ user: req.user.id }).then((profile)=>{
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then((profile) => res.json(profile));
    }
   else 
      {
        // Create

        // Check if handle exists
        Profile.findOne({ username: profileFields.username }).then((profile) => {
          if (profile) {
            errors.handle = "That username already exists";
            return res.status(400).json(errors);
          }
          // Save Profile
          new Profile(profileFields)
            .save()
            .then((profile) => res.json(profile));
        });
      }
   }
  );
});

module.exports = router;
