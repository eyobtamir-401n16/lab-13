'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema ({
  username: {type: 'String', unique:true , require: true},
  password:{type: 'String', require: true},
  fname:{type: 'String'},
  lname:{type: 'String'}
});

schema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.comparePasswords = async function (plainTextPass) {
  return await bcrypt.compare(plainTextPass, this.password);
};

schema.methods.generateToken = function (){
  let timeout = Math.floor(Date.now()/1000) + 10;

  return jwt.sign(
    {exp: timeout, data: {_id: this._id}},
    process.env.SECRET,
  )
}

schema.statics.verifyToken = function (token) {
  try{
    console.log('token', token)
    console.log('Process', process.env.SECRET)
    let tokenContents = jwt.verify(token, process.env.SECRET);
    
    console.log('tokenContents', tokenContents)
    return tokenContents.data;
  } catch(e){
    console.error('Invalid or Expired')
  }
  return {};
}

schema.statics.read = async function(_id){
  let record = await this.findOne({_id});
  return record;
}

module.exports = mongoose.model('users', schema);