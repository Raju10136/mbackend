//const logger = require('./logger');
const httpStatus = require('http-status');
const DatabaseService = require('../services/DatabaseService');
const Model = new DatabaseService();
const const_helper = require("../helpers/const_helper");
/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.create = async (req, res, next) => {
  try {       
    let id = await const_helper.insert(["type","pid","pdesc"],req.body);
    res.status(httpStatus.CREATED);
    return res.json({ id: id });
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {   
    let id = req.params.id !== undefined ? parseInt(req.params.id) : 0;
    await const_helper.update(id,["type","pid","pdesc"],req.body);
    res.status(httpStatus.OK);
    return res.json({ id: id });
  } catch (error) {
    //console.log(error);
    return next(error);
  }
};

exports.getall = async (req, res, next) => {
  try {
    let rows = await const_helper.get_all();
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

exports.getone = async (req, res, next) => {
  try {
    let id = req.params.id !== undefined ? parseInt(req.params.id) : 0;
    let rows = await const_helper.get_one(id);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};