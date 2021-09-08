"use strict";

let obj = () => {
  const md5 = require("md5");
  const moment = require("moment");
  const validator = require("validator");
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  const fn = {};

  fn.checkToken = async (req, res, next) => {
    try {
      let access_token = req.headers["access-token"] || "";

      // validate access token
      if (validator.isEmpty(access_token)) {
        throw { message: "Your access token is invalid or already expired." };
      }

      let detailToken = await req
        .model("auth")
        .getValidAccessToken(access_token);
      // validate access token
      if (detailToken == null) {
        throw { message: "Your access token is invalid or already expired." };
      }

      // if logged in select customer information
      if (detailToken.customer_id > 0) {
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

        // set customer & token into request object
        req.objUser = detailCustomer;
        req.objToken = detailToken;
      } else {
        // set customer & token into request object
        req.objUser = null;
        req.objToken = detailToken;
      }

      fn.login(req, res, next);
    } catch (e) {
      res.send(Object.assign({ status: 401 }, e));
    }
  };

  fn.checkLogin = async (req, res, next) => {
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

      // set activity
      await req.model("account").updateLogout(detailCustomer.u_id, now);

      // set customer & token into request object
      req.objUser = detailCustomer;
      req.objToken = detailToken;

      fn.logout(req, res, next);
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.getToken = async (req, res, next) => {
    try {
      let device_id = req.headers["device-id"] || "";
      let platform = req.headers.platform || "android";

      if (validator.isEmpty(device_id)) {
        throw { message: "Device ID is required." };
      }
      if (validator.isEmpty(platform)) {
        throw { message: "Platform is required." };
      }

      let userToken = await req.model("auth").getToken(device_id, platform);
      let result = {
        access_token: userToken.atoken_access,
        refresh_token: userToken.atoken_refresh,
      };
      res.send(result);
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.validPassword = async (password, savePass) => {
    return md5(password) == savePass ? true : false;
  };

  fn.login = async (req, res, next) => {
    try {
      let email = (req.body.email || "").trim();

      // check customer is already logged in or not
      if (req.objUser != null) {
        throw { message: "You are already logged in." };
      }

      // get customer detail
      let detailUser = await req.model("account").getUserEmail(email);
      // if customer not found, throw error
      if (detailUser == null) {
        // frontend must detect this error code and redirect to register page
        throw { message: "Your email is not registered." };
      }

      // validate password
      let password = await fn.validPassword(
        (req.body.password || "").trim(),
        detailUser.u_password
      );

      if (password == false) {
        throw { message: "Wrong Password" };
      }

      //do login!
      let dataLogin = {
        detailUser: detailUser,
        objToken: req.objToken,
      };
      let is_logged_in = await req.model("account").login(dataLogin);

      if (is_logged_in) {
        res.send({ status: 200, message: "Success" });
      } else {
        throw { message: "Sorry, we have problem when trying to log you in." };
      }
    } catch (e) {
      res.send(Object.assign({ status: 401 }, e));
    }
  };

  fn.logout = async (req, res, next) => {
    try {
      // validate phone + code
      await req
        .model("auth")
        .setCurrentTokenInactive(req.objToken.atoken_device);

      //init customer id and platform
      let customer_id = parseInt(req.objToken.customer_id) || 0;
      if (customer_id <= 0) {
        throw { message: "Invalid User ID." };
      }

      res.send({ status: 200, message: "Success" });
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.checkTokenAndRegister = async (req, res, next) => {
    try {
      let access_token = req.headers["access-token"] || "";

      // validate access token
      if (validator.isEmpty(access_token)) {
        throw { message: "Your access token is invalid or already expired." };
      }

      let detailToken = await req
        .model("auth")
        .getValidAccessToken(access_token);
      // validate access token
      if (detailToken == null) {
        throw { message: "Your access token is invalid or already expired." };
      }

      // if logged in select customer information
      if (detailToken.customer_id > 0) {
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

        // set customer & token into request object
        req.objUser = detailCustomer;
        req.objToken = detailToken;
      } else {
        // set customer & token into request object
        req.objUser = null;
        req.objToken = detailToken;
      }
      fn.register(req, res, next);
    } catch (e) {
      res.send(Object.assign({ status: 401 }, e));
    }
  };

  fn.checkLogin2 = async (req, res, next) => {
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

      // set activity
      await req.model("account").updateLogout(detailCustomer.u_id, now);

      // set customer & token into request object
      req.objUser = detailCustomer;
      req.objToken = detailToken;
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.register = async (req, res, next) => {
    try {
      // Initialize Variable
      let email = (req.body.email || "").trim().toLowerCase();
      let password = (req.body.password || "").trim();
      let role = parseInt((req.body.role || 0).trim());
      let now = moment().format("YYYY-MM-DD HH:mm:ss");
      let name = (req.body.name || "").trim();

      // Required Email
      if (validator.isEmpty(email))
        throw { message: "Email Address is required." };

      // Validate Email Format
      if (!validator.isEmail(email)) throw { message: "Invalid Email Address." };

      // Required Password
      if (validator.isEmpty(password)) throw { message: "Password is required." };

      // Validate Role
      // 0 : User
      // 1 : Admin
      if (role < 0 || role > 1) throw { message: "Invalid Role." };

      let data = [email, md5(password), name, role, now];

      let result = await req.model('account').insertUser(data);

      res.send(result);
    } catch (e) {
      res.send(Object.assign({ status: 400 ,error: e} ));
    }
  }

  return fn;
};

module.exports = obj;
