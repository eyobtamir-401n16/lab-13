'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const auth = require('../middleware/auth.js')
const router = express.Router();



/**
 * Model POST route
 * @group Model/
 * @route POST /model/
 * @returns {object} 201 -This route create data
 */

router.post('/signup-body',auth, async (req, res, next) => {
  let user = await UserModel.create(req.body);
  res.send(201);
  res.send(user);
});

router.post('/signup-headers',auth,  async (req, res, next) => {
  console.log('headers', req.headers.authorization)
  let basicAuth = req.headers.authorization.split(' ');

  if (basicAuth.length === 2 && basicAuth[0] === 'Basic'){
  let userData = base64Decoder(basicAuth[1]);
  let user = await UserModel.create({ ...userData, ...req.body});
  res.send(201);
  res.send(user)
  }
});

router.post('/signin', auth, async (req, res, next) => {
  
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

router.get('/users',auth,  async (req, res, next) => {
  let record = await UserModel.readByQuery(req.body);
  console.log('get', record);

  res.status(200);
  res.send(record);

});

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