"use strict"

let obj = () =>{
    const md5 = require("md5");
    const moment = require("moment");
    const validator = require("validator");
    const getMessage = require("../../src/errors")

    const fn = {}

    fn.getAllProject = async (req, res, next) => {
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
            
            let result = await req.model('project').getAllProject(customer_id);

            res.success(result)
            
        } catch (e) {
            next(e)
        }
    };

    fn.getProject = async (req, res, next) => {
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
            
            let result = await req.model('project').getProject(projectid, customer_id);

            res.success(result)
            
        } catch (e) {
            next(e)
        }
    };
    
    return fn
}

module.exports = obj
