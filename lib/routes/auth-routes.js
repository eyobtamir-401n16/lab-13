'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth.js')
const router = express.Router();
const Model= require('../models/model.js');
const userSchema = require('../models/users-schema.js');

const UserModel = new Model(userSchema);



/**
 * Model POST route
 * @group Model/
 * @route POST /model/
 * @returns {object} 201 -This route create data
 */

router.post('/signup',auth,  async (req, res, next) => {
 if(req.body.username && !req._id){
  let user = await UserModel.create(req.body);
  console.log('user', user)
  let token = user.generateToken();
  res.send({user, token})
  res.status(201);
  
 }else {
   next ({err: 401, msg: 'User already exists'})
 }
  
});

/**
 * Model POST route
 * @group Model/
 * @route POST /model/
 * @returns {object} 201 -This route create data
 */

router.post('/signin', auth, async (req, res, next) => {
  console.log('user', req.user)
  if(req.user._id){
    res.status(200);
    let token = req.user.generateToken();
    res.send({user: req.user, token: token})
    return
  }else{
    next ({err: 401, msg: 'User not Found'})
  }
});

/**
 * Model POST route
 * @group Model/
 * @route POST /model/
 * @returns {object} 201 -This route create data
 */
router.get('/hidden', auth, async(req, res, next) => {
  if(req.use._id){
    res.status(200);
    res.send('Secret information that only logged in usets can see')
  }
  else {
    next({ status: 401, message: 'Unauthorized' });
}
})




module.exports = router;