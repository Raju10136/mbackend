const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const schema_types = require("../services/core/schema_types");
const DatabaseService = require('../services/DatabaseService');
const OTPAuth = require('otp-authenticator');
// Create an OTP generator
const otpGenerator = new OTPAuth.Authenticator();
// schema'
const schema = {
    type: schema_types.SCHEMA_VARCHAR,
    users_ID: schema_types.SCHEMA_INTEGER,
    otp: schema_types.SCHEMA_VARCHAR,
    resend_limit: schema_types.SCHEMA_INTEGER,
    created_time: schema_types.SCHEMA_DATETIME
}

// table declaration
const TABLE_COSNT = "users_otp";

const generate_otp = () => {
    // Generate an OTP secret key
    const secret = otpGenerator.generateSecret();
    // Generate an OTP code
    const otpCode = otpGenerator.generate(secret);
    //
    return {
        secret: secret,
        otp: otpCode
    }
}

const verify_otp = (secret, otp) => {
    return otpGenerator.verify({ secret, token: otp });
}

/**
 * 
 * @param {*} id 
 * @returns 
 */
exports.get_one_otp = async (id) => {
    // model crreation
    const Model = new DatabaseService();
    let row = await Model.From(TABLE_COSNT).Where("users_ID=?").OrderBy("created_time DESC").One().getDataFull([id]);
    if (row !== undefined) {
        return row;
    } else {
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'No OTP found for the user',
        });
    }
};

/**
 * 
 * @param columns 
 * @param data 
 * @returns 
 */
exports.insert_otp = async (id) => {
    let columns = ["users_ID", "otp", "created_time"];
    let otp_data = generate_otp();
    let data = {
        users_ID: id,
        otp: otp_data.secret,
    };
    // model crreation
    const Model = new DatabaseService();
    await Model.Table(TABLE_COSNT).Columns(columns).insert(data);
    return otp_data.otp;
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