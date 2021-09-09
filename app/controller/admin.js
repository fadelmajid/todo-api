"use strict"

let obj = () => {
    const md5 = require("md5");
    const moment = require("moment");
    const validator = require("validator");

    const fn = {}

    fn.getAllUsers = async (req, res, next) => {
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
            if (detailCustomer.u_role != 1) {
                throw { message: "You are not authorized to access this page." };
            }
            let result = await req.model('account').getAllUsers();
            res.send(result);
        } catch (e) {
            res.send({ status: 400, message: "Oops sorry, something went wrong!" });
        }
    };

    fn.getUser = async (req, res, next) => {
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
            if (detailCustomer.u_role != 1) {
                throw { message: "You are not authorized to access this page." };
            }
            let result = await req.model('account').getUser(req.params.id);
            res.send(result);
        } catch (e) {
            res.send(Object.assign({ status: 400 }, e));
        }
    };

    fn.softDelete = async (req, res, next) => {
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
            if (detailCustomer.u_role != 1) {
                throw { message: "You are not authorized to access this page." };
            }
            await req.model('account').deleteAccount(req.params.id);
            res.send(Object.assign({ status: 200, message: "Delete Account Successful"}))
        } catch (e) {
            res.send(Object.assign({ status: 400}, e));
        }
    }



    return fn
}

module.exports = obj
