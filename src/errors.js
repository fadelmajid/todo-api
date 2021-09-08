'use strict'

let getMessage = (code) =>{
    
    let messages = {
        success : "Success",
        udf001 : "Invalid userid",
        udf002 : "Invalid projectid",
        udf003 : "Invalid taskid",
        udf004 : "Cannot find data",
        udf005 : "Authentication failed",
        udf006 : "Project title is required",
        udf007 : "Project status cannot empty",
        udf008 : "Project description is required",
        udf009 : "Project deadline cannot empty",
        udf010 : "Task title is required",
        udf011 : "Task status cannot empty",
        udf012 : "Task description is required",
        udf013 : "Task deadline cannot empty",
    }
    let sendObj = {
        message : messages[code]
    }
    
    return sendObj

}

module.exports = getMessage