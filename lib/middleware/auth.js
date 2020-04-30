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

  for(let i = 0; i<maybeUsers.length; i++){
    let isSame = maybeUsers[i].comparePasswords(userData.password);

    if(isSame){
      return maybeUsers[i];
    }
   
  };
  return userData;
};

const auth = async (req, res, next) => {
  let authPieces = req.headers.authorization.split('');

  if(authPieces.length === 2){
    if(authPieces[0] === 'Basic'){
      let authData = base64Decoder(authPieces[1])
      req.user = await getUserFromCredetials(authData);

      next();
      return;
    }
    else if (authPieces[0] === 'Beare') {
      let tokenData = UserModel.verifyToken(authPieces[1]);


      if(tokenData && tokenData._id){
        req.user - await UserModel.read(tokenData._id)
      }
      next();
      return;
    }
  }
  next((e)=>{
    console.error('401 Missing correct authoriztion header')
  })
}

module.exports = auth;