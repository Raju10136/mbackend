const httpStatus = require('http-status');
const passport = require('passport');
const APIError = require('../errors/api-error');
const auth_helper = require("../helpers/auth_helper");

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

/*

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  /*
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
  } catch (e) {
    return next(apiError);
  }

  if (roles === LOGGED_USER) {
    if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }
  
  req.user = user;

  return next();
};
*/

const  handleJWT =async (req, res, next,allowedRoles) =>{  
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    //console.log(req.headers);
    if (token == null) {
      return res.sendStatus(401);
    }
    const apiError = new APIError({
      message:  'Unauthorized',
      status: httpStatus.UNAUTHORIZED   
    });
    try{
      console.log("dataoutr","test");
      let user_data = await auth_helper.verify_token(token);
      //console.log("user",user_data);
      req.user = user_data;
      next();  
    }catch (e) {
      return next(apiError);
    }

    // check for roles

    
}

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;

exports.authorize = (roles = []) => async(req, res, next) => {
  return await handleJWT(req, res, next, roles);
}

exports.oAuth = (service) => passport.authenticate(service, { session: false });
