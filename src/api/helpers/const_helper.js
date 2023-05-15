const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const schema_types = require("../services/core/schema_types");
const DatabaseService = require('../services/DatabaseService');
// schema'
const schema  = {
    type:schema_types.SCHEMA_VARCHAR,
    pid:schema_types.SCHEMA_INTEGER,
    pval:schema_types.SCHEMA_VARCHAR
}
// model crreation
const Model = new DatabaseService();
// table declaration
const TABLE_COSNT = "const";

/**
 * 
 * @param {*} id 
 * @returns 
 */
exports.get_one = async (id) => {
    let row = await Model.From(TABLE_COSNT).Where("ID=?").One().getDataFull([id]);
    if(row!==undefined){
        return row;
    }else{
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'No account found with that id',
        });  
    }    
};

exports.get_all = async (sql,data,select=[],order_by="",count=false) => {
    let rows = await Model.From(TABLE_COSNT).getDataFull([]);
    return rows;
};

exports.insert = async (columns, data) => {
    let id = await Model.Table(TABLE_COSNT).Columns(columns).insert(data);
    return id;
}

exports.update = async (id, columns, data) => {
    let row_data = await this.get_one(id);
    if (row_data !== undefined && row_data["ID"] !== undefined) {
        await Model.Table(TABLE_COSNT).Columns(columns).update(data, id);
        return id;
    } else {
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'No account found with that id',
        });
    }

}