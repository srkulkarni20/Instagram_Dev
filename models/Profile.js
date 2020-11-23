const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
  },
  username: { //unique handle
    type: String,
    required: true,
    max: 40
  },
  phone_num:{
    type: String
  },
  posts: {
    type: Number,
  },
  followers: [
    {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
   
  }
],
  following: [
    {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
    
  }
],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
   
  },
  bio: {
    type: String
  },



})

module.exports = Profile = mongoose.model('profile', ProfileSchema);