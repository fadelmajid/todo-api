"use strict"

let obj = () =>{
    const md5 = require("md5");
    const moment = require("moment");
    const validator = require("validator");

    const fn = {}

    fn.getAllTasks = async (req, res, next) => {
        try {
            let projectid = parseInt(req.params.projectid)

            if(projectid <= 0) throw getMessage("udf002")
            let result = await req.model('task').getAllTask(projectid);
            res.send(result);
        } catch (e) {
            next(e);
        }
    };

    fn.getTask = async (req, res, next) => {
        try {
            let taskid = parseInt(req.params.taskid)

            if(taskid <= 0) throw getMessage("udf003")
            let result = await req.model('task').getTask(taskid);
            res.send(result);
        } catch (e) {
            next(e);
        }
    };

    return fn
}

module.exports = obj
