const schema_types = require("../services/core/schema_types");
// schema creation for users
export const schema  = {
    username:schema_types.SCHEMA_VARCHAR,
    password:schema_types.SCHEMA_VARCHAR,
    email:schema_types.SCHEMA_VARCHAR,
    dob:schema_types.SCHEMA_DATE,
    role_master_id:schema_types.SCHEMA_INTEGER,
    pass_reset:schema_types.SCHEMA_INTEGER,
    last_login:schema_types.SCHEMA_DATETIME,
    last_login_ip:schema_types.SCHEMA_VARCHAR,
    pass_reset_time:schema_types.SCHEMA_DATETIME,
    pass_reset_by:schema_types.SCHEMA_VARCHAR,
    created_by:schema_types.SCHEMA_VARCHAR,
    created_time:schema_types.SCHEMA_DATETIME,
    updated_by:schema_types.SCHEMA_TEXT,
    updated_time:schema_types.SCHEMA_DATETIME
}

