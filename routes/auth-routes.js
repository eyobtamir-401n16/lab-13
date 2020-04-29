'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const Model= require('../models/model.js');
const userSchema = require('../models/users-schema.js');

const UserModel = new Model(userSchema);
const router = express.Router();

const base64Decoder = (encodedString) => {
  let data = {
    username: '',
    password: ''
  };
let decodedString = Buffer.from(encodedString, 'base64').toString();
let dataPieces = decodedString.split(':');

data.username = dataPieces[0];
data.password = dataPieces[1];
console.log('data', data)
return data;
};

/**
 * Model POST route
 * @group Model/
 * @route POST /model/
 * @returns {object} 201 -This route create data
 */

router.post('/signup-body', async (req, res, next) => {
  let user = await UserModel.create(req.body);
  res.send(201);
  res.send(user);
});

router.post('/signup-headers', async (req, res, next) => {
  console.log('headers', req.headers.authorization)
  let basicAuth = req.headers.authorization.split(' ');

  if (basicAuth.length === 2 && basicAuth[0] === 'Basic'){
  let userData = base64Decoder(basicAuth[1]);
  let user = await UserModel.create({ ...userData, ...req.body});
  res.send(201);
  res.send(user)
  }
});

router.post('/signin', async (req, res, next) => {
  
  let basicAuth = req.headers.authorization.split(' ');

  if (basicAuth.length === 2 && basicAuth[0] === 'Basic') {
      let userData = base64Decoder(basicAuth[1]);

      let possibleUsers = await UserModel.readByQuery({
          username: userData.username,
      });

      for (let i = 0; i < possibleUsers.length; i++) {
          let isSame = await bcrypt.compare(
              userData.password,
              possibleUsers[i].password,
          );

          if (isSame) {
              req.user = possibleUsers[i];
              break;
          }
      }

      if (req.user) {
          res.status(200);
          res.send(req.user);
      } else {
          next({ status: 401, message: 'Unauthorized' });
      }
  }

  res.end();
});

router.get('/users', async (req, res, next) => {
  let record = await UserModel.readByQuery(req.body);
  console.log('get', record);

  res.status(200);
  res.send(record);

});





module.exports = router;