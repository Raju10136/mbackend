const Joi = require('joi');
//const User = require('../models/user.model');

module.exports = {

  // POST /v1/users
  insertOne: {
    body: {
      type: Joi.string().max(255).required(), 
      pid: Joi.string().max(255).required(),     
      pdesc: Joi.string().max(255).required(),     
    },
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
