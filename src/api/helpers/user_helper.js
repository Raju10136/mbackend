const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const DatabaseService = require('../services/DatabaseService');
const schema_types = require("../services/core/schema_types");
const bcrypt = require('bcryptjs');
const global_const = require("../services/core/global_constants");
// dchema creation
const schema = {
    username: schema_types.SCHEMA_VARCHAR,
    password: schema_types.SCHEMA_VARCHAR,
    first_name: schema_types.SCHEMA_VARCHAR,
    middle_name: schema_types.SCHEMA_VARCHAR,
    last_name: schema_types.SCHEMA_VARCHAR,
    full_name: schema_types.SCHEMA_VARCHAR,
    gender: schema_types.SCHEMA_VARCHAR,
    title: schema_types.SCHEMA_VARCHAR,
    email: schema_types.SCHEMA_VARCHAR,
    dob: schema_types.SCHEMA_DATE,
    role_master_id: schema_types.SCHEMA_INTEGER,
    pass_reset: schema_types.SCHEMA_INTEGER,
    last_login_time: schema_types.SCHEMA_DATETIME,
    last_login_ip: schema_types.SCHEMA_VARCHAR,
    pass_reset_time: schema_types.SCHEMA_DATETIME,
    pass_reset_by: schema_types.SCHEMA_VARCHAR,
    created_by: schema_types.SCHEMA_VARCHAR,
    created_time: schema_types.SCHEMA_DATETIME,
    updated_by: schema_types.SCHEMA_TEXT,
    updated_time: schema_types.SCHEMA_DATETIME
}

// table declaration
const TABLE = "sd_mt_userdb";
// hash the password
const hash_password = async (pass_sting) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass_sting, salt);
}
// get the full name
const full_name_disp = (body) => {
    let first_name = body.first_name ? body.first_name : "";
    let middle_name = body.middle_name ? body.middle_name : "";
    let last_name = body.middle_name ? body.middle_name : "";
    return first_name + " "+middle_name + " " + last_name;
}

const insert = async (columns, data) => {
    let id = await Model.Table(TABLE).Columns(columns).insert(data);
    return id;
}
/**
 * 
 * @param {*} sql 
 * @param {*} data 
 * @param {*} select 
 * @param {*} order_by 
 * @param {*} count 
 * @returns 
 */
const get_all = async (params = {}) => {
    const { sql = "", data = {}, from = "", select = [], group_by = "", order_by = "", totcount = false, single = false } = params;
    // model crreation
    const Model = new DatabaseService();
    Model.From(TABLE);
    Model.Where(sql);
    Model.Select(select);
    Model.OrderBy(order_by);
    Model.GroupBy(group_by);
    if (single === true || totcount === true) {
        Model.One();
    }
    // force select to count * if count is true
    if (totcount === true) {
        Model.Select(["count(*) as totalcount"]);
    }

    let data_in = data !== undefined ? data : {};
    // 
    let rows = await Model.getDataFull(data_in);
    //
    if (totcount === true) {
        let total_count = rows.totalcount != undefined ? rows.totalcount : 0;
        //
        return total_count;
    }
    // 
    return rows;
};
/**
 * 
 * @param {*} id 
 * @param {*} columns 
 * @param {*} data 
 * @returns 
 */
const update = async (id, columns, data) => {
    // model crreation
    const Model = new DatabaseService();
    let row_data = await get_one(id);
    if (row_data !== undefined && row_data["ID"] !== undefined) {
        await Model.Table(TABLE).Columns(columns).update(data, id);
        return id;
    } else {
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'No account found with that id',
        });
    }

}
/**
 * 
 * @param {*} id 
 * @returns 
 */
const get_one = async (id) => {
    // model crreation
    const Model = new DatabaseService();
    let row = await Model.From(TABLE).Where("ID=?").One().getDataFull([id]);
    console.log("row=", row);
    if (row !== undefined) {
        return row;
    } else {
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'No account found with that id',
        });
    }
};
/**
 * 
 * @param {*} userid 
 * @returns 
 */
const get_one_userid = async (userid) => {
    // model crreation
    const Model = new DatabaseService();
    let sql = "username=?";
    let data_in = [userid];
    let row = await get_all({ sql: sql, data: data_in, single: true })
    if (row !== undefined) {
        return row;
    } else {
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'No account found with that username',
        });
    }
};
/**
 * 
 * @param {*} row 
 * @param {*} pass 
 * @returns 
 */
const compare_password = async (row, pass) => {   
    let result =  await bcrypt.compare(pass,row.password);
    return result;    
}
/**
 * 
 * @param {*} id 
 * @param {*} pass 
 * @param {*} role 
 */
const reset_password = async (id, pass, role = "USER") => {
    let insert_columns = [
        "password", "pass_reset_time", "pass_reset_by"
    ];
    let data = {
        password: await hash_password(pass),
        pass_reset_by: role,
        pass_reset_time: global_const.CDATETIME
    };   
    await update(id, insert_columns, data);
}


module.exports = {
    insert: insert,
    get_all: get_all,
    update: update,
    get_one: get_one,
    hash_password: hash_password,
    full_name_disp: full_name_disp,
    get_one_userid: get_one_userid,
    compare_password: compare_password,
    reset_password: reset_password
}