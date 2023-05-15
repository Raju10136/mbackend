const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/const_controller');
const {
  insertOne,
  updateOne
} = require('../../validations/const.validation');
// router express js
const router = express.Router();

router
  .route('/get_all')
  /**
   * @api {get} v1/users List Users
   * @apiDescription Get a list of users
   * @apiVersion 1.0.0   
   *
   * @apiSuccess {Object[]} users List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(controller.getall)
  /**
   * @api {post} v1/users Create User
   * @apiDescription Create a new user
   * @apiVersion 1.0.0   
   */
  .post(controller.create);

  router
  .route('/get_one/:id')
  /**
   *  get single row with id
   */
  .get(controller.getone)


  router
  .route('/insert')
  /**
   *  get single row with id
   */
  .post(validate(insertOne),controller.create)

  router
  .route('/update/:id')
  /**
   *  get single row with id
   */
  .post(validate(updateOne),controller.update)





  module.exports = router;