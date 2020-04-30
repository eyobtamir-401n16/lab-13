'use strict'
const Model= require('../models/model.js');
const userSchema = require('../models/users-schema.js');

const UserModel = new Model(userSchema);

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

const getUserFromCredetials = async (userData) => {
  let maybeUsers = await UserModel.readByQuery({
    username: userData.username,
    
  })
  console.log('maybeUsers' ,maybeUsers)

  for(let i = 0; i<maybeUsers.length; i++){
    let isSame = maybeUsers[i].comparePasswords(userData.password);

    if(isSame){
      return maybeUsers[i];
    }
   
  };
  return userData;
};

const auth = async (req, res, next) => {
  console.log('inside auth')
  let authPieces = req.headers.authorization.split(' ');
  console.log('authPieces', authPieces)
  if(authPieces.length === 2){
    if(authPieces[0] === 'Basic'){
      let authData = base64Decoder(authPieces[1])
      console.log('auth', authData)
      req.user = await getUserFromCredetials(authData);
      console.log('req.user', req.user)

      next();
      return;
    }
    else if (authPieces[0] === 'Bearer') {
      console.log('auth', authPieces[1])
      let tokenData = UserModel.schema.verifyToken(authPieces[1]);
      console.log('tokenDatadfsdf', tokenData)
      if(tokenData && tokenData._id){
        req.user - await UserModel.read(tokenData._id)
      }
      next();
      return;
    }
  }
  next()
}

module.exports = auth;