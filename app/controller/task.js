"use strict"

let obj = () =>{
    const md5 = require("md5");
    const moment = require("moment");
    const validator = require("validator");

    const fn = {}

    fn.getAllTasks = async (req, res, next) => {
        try {
            let access_token = req.headers["access-token"] || "";

            // validate access token
            if (validator.isEmpty(access_token)) {
              throw { message: "Your access token is invalid or already expired." };
            }
      
            // get detail token by access token
            let detailToken = await req
              .model("auth")
              .getValidAccessToken(access_token);
      
            // validate access token
            if (detailToken == null) {
              throw { message: "Your access token is invalid or already expired." };
            }
      
            // validate customer login
            if (detailToken.customer_id <= 0) {
              throw { message: "You are not authorized to access this page." };
            }
      
            // get customer detail
            let detailCustomer = await req
              .model("account")
              .getUser(detailToken.customer_id);
            // if customer not found, throw error
            if (detailCustomer == null) {
              // inactive token by device id
              await req.model("auth").setTokenInactive(detailToken.atoken_device);
              throw { message: "User not found, please re-login." };
            }

            let projectid = parseInt(req.params.projectid)
            let result1 =  await req.model('project').getProject(projectid, customer_id);
            if(result1 == null) { 
                throw {message: "You can't access this project/task"}
            }
            let result2  = await req.model('task').getAllTask(projectid);
            res.send(result2);
        } catch (e) {
            next(e);
        }
    };

    fn.getTask = async (req, res, next) => {
        try {
            let access_token = req.headers["access-token"] || "";

            // validate access token
            if (validator.isEmpty(access_token)) {
              throw { message: "Your access token is invalid or already expired." };
            }
      
            // get detail token by access token
            let detailToken = await req
              .model("auth")
              .getValidAccessToken(access_token);
      
            // validate access token
            if (detailToken == null) {
              throw { message: "Your access token is invalid or already expired." };
            }
      
            // validate customer login
            if (detailToken.customer_id <= 0) {
              throw { message: "You are not authorized to access this page." };
            }
      
            // get customer detail
            let detailCustomer = await req
              .model("account")
              .getUser(detailToken.customer_id);
            // if customer not found, throw error
            if (detailCustomer == null) {
              // inactive token by device id
              await req.model("auth").setTokenInactive(detailToken.atoken_device);
              throw { message: "User not found, please re-login." };
            }

            let result1 = await req.model('task').getTask(taskid);
            let result2 =  await req.model('project').getProject(result1.t_mp_fk, customer_id);
            if(result2 == null){
                throw {message: "You can't access this project/task"}
            }
            res.send(result1);
        } catch (e) {
            next(e);
        }
    };

    

    return fn
}

module.exports = obj
