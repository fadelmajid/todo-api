"use strict"

let obj = () =>{
    const md5 = require("md5");
    const moment = require("moment");
    const validator = require("validator");
    const getMessage = require("../../src/errors")

    const fn = {}

    fn.getAllProject = async (req, res, next) => {
        try {
            let userid = parseInt(req.params.userid)
            
            //check userid
            if(userid <= 0) throw getMessage("udf001")
            let result = await req.model('project').getAllProject(userid);

            res.success(result)
            
        } catch (e) {
            next(e)
        }
    };

    fn.getProject = async (req, res, next) => {
        try {
            let projectid = parseInt(req.params.projectid)
            
            //check userid
            if(projectid <= 0) throw getMessage("udf002")
            let result = await req.model('project').getProject(projectid);

            res.success(result)
            
        } catch (e) {
            next(e)
        }
    };
    
    return fn
}

module.exports = obj
