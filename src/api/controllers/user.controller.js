const httpStatus = require('http-status');
const { omit } = require('lodash');
//const User = require('../models/user.model');
const user_helper = require("../helpers/user_helper");
const global_const = require("../services/core/global_constants");
//

/**'[]
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {       
    let insert_columns = [
      "username","first_name","middle_name","password",
      "last_name","full_name","gender","title","email","dob","pass_reset","created_by","created_time"
    ];
    req.body.password = await user_helper.hash_password(req.body.username);
    req.body.full_name = user_helper.full_name_disp(req.body);
    let id = await user_helper.insert(insert_columns,req.body);
    res.status(httpStatus.CREATED);
    return res.json({ id: id });
  } catch (error) {
    return next(error);
  }
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.reset_password_user = async (req, res, next) => {
  try {       
    let password = await user_helper.hash_password(req.body.password);   
    let id = req.user.ID!==undefined ? req.user.ID : 0;    
    await user_helper.reset_password(id,password,"USER");
    res.status(httpStatus.CREATED);
    return res.json({ id: id });
  } catch (error) {
    return next(error);
  }
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.reset_password_admin = async (req, res, next) => {
  try {       
    let password = req.body.password;   
    let id = req.body.id!==undefined ? req.body.id : 0;    
    await user_helper.reset_password(id,password,"ADMIN");
    res.status(httpStatus.CREATED);
    return res.json({ id: id });
  } catch (error) {
    return next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    let rows = await user_helper.get_all();
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    let id = req.params.id !== undefined ? parseInt(req.params.id) : 0;
    let rows = await user_helper.get_one(id);
   
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

/**
 * Replace existing user
 * @public
 *
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 *
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 *
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map((user) => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 *
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
*/
