'use strict'

let getMessage = (code) =>{
    
    let messages = {
        success : "Success",
        udf001 : "Invalid userid",
        udf002 : "Invalid projectid",
        udf003 : "Invalid taskid",
    }
    let sendObj = {
        message : messages[code]
    }
    
    return sendObj

}

module.exports = getMessage