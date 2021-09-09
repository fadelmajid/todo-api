"use strict";

let obj = () => {
  const md5 = require("md5");
  const moment = require("moment");
  const validator = require("validator");

  const fn = {};

  fn.getAllUsers = async (req, res, next) => {
    try {
      let result = await req.model("account").getAllUsers();
      res.send(result);
    } catch (e) {
      res.send({ status: 400, message: "Oops sorry, something went wrong!" });
    }
  };

  fn.getUser = async (req, res, next) => {
    try {
      let result = await req.model("account").getUser(req.params.id);
      res.send(result);
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.checkAdmin = async (req, res, next) => {
    try {
      if (req.objUser.u_role == 0) {
        throw { message: "You are not authorized to access this page." };
      }

      next();
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.softDelete = async (req, res, next) => {
    try {
      let result = await req.model("account").updateUserStatus(req.params.id);
      res.send(result);
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  return fn;
};

module.exports = obj;
