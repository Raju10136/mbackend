const sqllitedb = require('./../../config/sqllitedb');
const APIError = require('../errors/api-error');
const schema_types = require("./core/schema_types");
const global_constants = require("./core/global_constants");
const httpStatus = require('http-status');
const mariadb = require('mariadb');
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'test_1234',
    database: 'sd_ebook',
    port: 3307,
    connectionLimit: 5 // Adjust the connection limit based on your needs
 };
const pool = mariadb.createPool(dbConfig);

module.exports = class DatabaseService {

    schema={}
    table_name = "";
    columns = ["*"];
    from_sql = "";
    where_sql = "";
    order_by_sql = "";
    group_by_sql = "";
    limit_flag = 0;

    dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'test_1234',
        database: 'sd_ebook',
        connectionLimit: 5 // Adjust the connection limit based on your needs
     };

    // pool=null;

    constructor(schema={}){
        this.schema=schema;
       
        
    }

    Table = (table_name) => {
        this.table_name = table_name;
        return this;
    }

    From = (sql) => {
        this.from_sql = sql;
        return this;
    }

    OrderBy = (sql) => {
        this.order_by_sql  = sql;
        return this;
    }
    GroupBy = (sql)=>{
        this.group_by_sql = sql;
        return this;
    }

    One = () => {
        this.limit_flag = 1;
        return this;
    }

    Where = (sql) => {
        this.where_sql = sql;
        return this;
    }

    Select = (columns) => {
        this.columns = columns;
        return this;
    }
    Columns=(columns)=>{
        this.columns = columns;
        return this;
    }
    /**
     * 
     * @param {*} sql 
     * @returns 
     */
    select_query = (sql) => {
        return new Promise((resolve, reject) => {
            sqllitedb.select(sql, function (error, data) {
                if (error) {
                    reject(error);
                }
                resolve(data);
            })
        });
    }
    //
    get_value=(col_name,data)=>{
        // get the type from schema
        let col_type = this.schema.col_name!==undefined ? this.schema.col_name : "";
        //
        let col_value = data[col_name]!==undefined ? data[col_name] : null;
        //
        if(col_value==null){
            return null;
        }
        // 
        switch(col_type){
            case schema_types.SCHEMA_INTEGER : return parseInt(col_value);
            case schema_types.SCHEMA_FLOAT : return parseFloat(col_value);
            case schema_types.SCHEMA_DOUBLE : return parseFloat(col_value);
            case schema_types.SCHEMA_VARCHAR : return col_value.replace(/<(.|\n)*?>/g, '');
            case schema_types.SCHEMA_DATE : return global_constants.date_format(col_value);
            case schema_types.SCHEMA_DATETIME:return global_constants.date_format(col_value,"YYYY-MM-DD HH:mm:ss");
            //case schema_types.SCHEMA_DATE_DEFAULT : return global_constants.CDATE;
            //case schema_types.SCHEMA_DATETIME_DEFAULT: return global_constants.CDATETIME;
            default: return col_value;
        }
    }
    /**
     * 
     * @param {*} data 
     * @returns 
     */
    prepareInsertQuery=(data)=>{
        let sql = "INSERT INTO " + this.table_name +" ";
        // insert columns
        let insert_columns=[];
        let insert_data = [];
        for(let i=0;i<this.columns.length;i++){
            let col_name = this.columns[i];
            let col_value = this.get_value(col_name,data);
           if(col_value!==null){
             insert_columns.push(col_name);
             insert_data.push("'"+col_value+"'");
           }
        }
        // select portion
        sql +=" (" + insert_columns.join(",") + ") VALUES (" + insert_data.join(",") + ") ";      
        //
        return sql;
    }

    insert = (data) => {
        return new Promise((resolve, reject) => {
            let insert_query = this.prepareInsertQuery(data);
            console.log(insert_query);
            sqllitedb.run(insert_query, function(err) {
                if(null == err){
                    data["id"] = this.lastID;
                    resolve(data);
                } else {
                    reject(err)
                }
            });           
        });
    }

    prepareUpdateQuery=(data,id,id_column)=>{
        let sql = "UPDATE " + this.table_name +" ";
        // insert columns
        let insert_columns=[];
        let insert_data = [];
        for(let i=0;i<this.columns.length;i++){
            let col_name = this.columns[i];
            let col_value = this.get_value(col_name,data);
           if(col_value!==null){
             insert_columns.push(col_name +"=?");
             insert_data.push(""+col_value+"");
           }
        }
        // add id at last 
        insert_data.push(id);
        // select portion
        sql +=" SET " + insert_columns.join(",") + " WHERE "+id_column+"=?";      
        //
        return {sql:sql,data:insert_data};
    }


    /**
     * 
     * @param {*} data 
     * @param {*} id 
     * @param {*} id_column 
     */
    update = (data, id, id_column = "ID") => {
        return new Promise((resolve, reject) => {
        let query = this.prepareUpdateQuery(data,id,id_column);
        sqllitedb.run(query.sql,query.data,function(err) {
            if(null == err){   
                data["id"] = id;            
                resolve(data);
            } else {
                reject(err)
            }
        }); 
       });
    }
    /**
     * 
     * @param {*} id 
     * @param {*} id_column 
     */
    delete=(id,id_column="ID")=>{
        let sql = "DELETE FROM " + this.table_name +" WHERE "+id_column+"=(?)";
        sqllitedb.run(sql, id, function(err) {
            if(null == err){                       
                resolve(true);
            } else {
                reject(err)
            }
        });
    }
    /**
     * 
     * @param {*} data 
     */
    deleteQuery=(data)=>{
        let sql = "DELETE FROM " + this.table_name +" WHERE "+this.where_sql+"";
        sqllitedb.run(sql, data, function(err) {
            if(null == err){                       
                resolve(true);
            } else {
                reject(err)
            }
        });
    }  

    prepareSqlQuery=()=>{
        let sql = "SELECT ";
        // select portion
        sql +=" " + this.columns.length > 0 ? this.columns.join(",") : "*";
        // from portion
        sql +=" FROM " + this.from_sql;
        // where potion
        sql +=" " + this.where_sql.length > 0 ? " WHERE " + this.where_sql : "";
        // order by 
        sql +=" " + this.order_by_sql.length > 0 ? " ORDER BY " + this.order_by_sql : "";
        // group by
        sql +=" " + this.group_by_sql.length > 0 ? " GROUP BY " + this.group_by_sql : "";
        //
        return sql;
    }

    getDataFull = async(params) => {
        let sql_param = this.prepareSqlQuery();
       // console.log(" test sql = ", sql_param, "params=",params);
       if (this.limit_flag === 1) {
            sql_param += " LIMIT 0,1";
            let data_out = await this.executeQuery(sql_param,params);
            return data_out[0] !==undefined ? data_out[0] : {};
       }else{
            return await this.executeQuery(sql_param,params);
       }
        /*
        return new Promise(async(resolve, reject) => {
            let sql_param = this.prepareSqlQuery();
           // console.log("sql = ", sql_param, "params=",params);
            // only one row
            if (this.limit_flag === 1) {
                /*
                sqllitedb.get(sql_param,params,(error, row) => {
                    if(error){
                        reject(error);
                    }
                    resolve(row);
                });                
            }else{
                return await this.executeQuery(sql_param,params);
                /*
                sqllitedb.all(sql_param,params,(error, rows) => {
                    if(error){
                        reject(error);
                    }
                    resolve(rows);
                });

            }          
        });*/
    }

    executeQuery=async(query, values = []) =>{
        let conn;
        try {
          conn = await pool.getConnection();
          const result = await conn.query(query, values);
          return result;
        } catch (err) {
          throw err;
        } finally {
          if (conn) conn.release();
        }
      }


}





