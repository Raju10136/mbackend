const Joi = require('joi');

module.exports = {

  // POST /v1/users
  insertOne: {
    body: {
      username: Joi.string().max(255).required(), 
      first_name: Joi.string().max(255).required(),     
      gender: Joi.string().max(25).required(),     
    },
  },
  resetPass: {
    body: {
      password: Joi.string().max(255).required() 
    },
  },
  resetPassAdmin: {
    body: {
      password: Joi.string().max(255).required(),
      id: Joi.string().regex(/^[0-9]$/).required(),
    }
  },
 // POST /const/update
  updateOne: {
    body: {
        type: Joi.string().max(255).required(), 
        pid: Joi.string().max(255).required(),     
        pdesc: Joi.string().max(255).required(),       
    },
    /*
    params: {
        id: Joi.string().regex(/^[0-9]$/).required(),
      },
      */
  },
 
};



//const User = require('../models/user.model');
/*
module.exports = {


  // POST /users/insert
  insertOne: {
    body: {
      username: Joi.string().max(255).required(), 
      first_name: Joi.string().max(255).required(),     
      gender: Joi.string().max(25).required(),     
    },
  }

  /*

  // GET /v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(User.roles),
    },
  },

  // POST /v1/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};

*/
