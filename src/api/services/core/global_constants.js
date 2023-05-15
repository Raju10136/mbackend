let date_time = new Date();

// get current date
// adjust 0 before single digit date
let date = ("0" + date_time.getDate()).slice(-2);

// get current month
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

// get current year
let year = date_time.getFullYear();

// get current hours
let hours = date_time.getHours();

// get current minutes
let minutes = date_time.getMinutes();

// get current seconds
let seconds = date_time.getSeconds();
// current date format
exports.CDATE = year + "-" + month + "-"+date;
// current date and time db format
exports.CDATETIME = year + "-" + month + "-"+date + " " + hours + ":"+minutes+":"+seconds;
// current date in print format
exports.CDATE_NORM = date+"-"+month+"-"+year;
// year
exports.CYEAR = year;
// formats date
exports.date_format=(date_str,format="YYYY-MM-DD")=>{
    return dayjs(date_str).format(format);
}

