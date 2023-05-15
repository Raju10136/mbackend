const logger = require('./logger');
const {sqllite, env } = require('./vars');
const sqlite3 = require('sqlite3');
//console.log("sqllqite fule = ",sqllite.file); 
const db = new sqlite3.Database(sqllite.file);
//const sqllite3db = require('sqlite3-wrapper');
/*
const db = sqllite3db.open(sqllite.file,(err)=>{
   
});*/
module.exports=db;
