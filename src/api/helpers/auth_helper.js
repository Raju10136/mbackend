const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_helper = require("./user_helper");
const users_otp_helper = require("./users_otp_helper")
const moment = require('moment-timezone');
const { jwtExpirationInterval,  jwtRefreshSecret,jwtSecret} = require('../../config/vars');


const expiresIn = jwtExpirationInterval * 60;

// Generate a JWT access token
const generateAccessToken = (user)=> {
    return jwt.sign(user, jwtSecret, { expiresIn: expiresIn });
}

// Generate a JWT refresh token
const  generateRefreshToken = (user)=> {
    return jwt.sign(user, jwtRefreshSecret);
}

// pack the token data initial
const pack_login_data=(user)=>{
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return {
        accessToken,
        refreshToken,
        expiresIn,
      };
}
// check the password and generate the token
module.exports.login_check=async(userid,pass)=>{
    // check in user helper
    let user = await user_helper.get_one_userid(userid);
    //console.log(user);
    // compare the password 
    if(user.ID!==undefined && await user_helper.compare_password(user,pass)){
        user.password = "";
        return pack_login_data(user);
    }else{
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'Username and Password Does Not Match',
        });  
    }   
    
}
// jwt token verify the userdata
module.exports.verify_token=async(token)=>{
    let user = await  jwt.verify(token, jwtSecret);
    //console.log("u=",user);
    return user;   
}
// refresh toke
module.exports.refresh_token=(token)=>{
    try{
        let user = jwt.verify(token, jwtRefreshSecret);
        if(user){
            const accessToken = generateAccessToken(user);
            return {
                accessToken,           
                expiresIn,
              };
        }
    }catch(err){
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'Invalid refresh Token',
        }); 
    }   
}


module.exports.send_otp=async(userid)=>{
     // check in user helper
     let user = await user_helper.get_one_userid(userid);
     //console.log(user);
     // compare the password 
     if(user.ID!==undefined){
        let otp = users_otp_helper.insert_otp(user.ID);
        // send this otp to user through mail
        console.log("otp = " , otp);
       //  user.password = "";
        return otp;
     }else{
         throw new APIError({
             status: httpStatus.UNAUTHORIZED,
             message: 'Username and Password Does Not Match',
         });  
     }   
}

  