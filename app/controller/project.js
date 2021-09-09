"use strict";

let obj = () => {
  const md5 = require("md5");
  const moment = require("moment");
  const validator = require("validator");
  const getMessage = require("../../src/errors");

  const fn = {};

  fn.getAllProject = async (req, res, next) => {
    try {
      let userid = parseInt(req.objUser.u_id) || 0;

      //check userid
      if (userid <= 0) throw { message: "User not found." };

      let result = await req.model("project").getAllProject(userid);

      if (result.length == 0) {
        throw { message: "Empty List." };
      } else {
        res.send(result);
      }
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.getProject = async (req, res, next) => {
    try {
      let projectid = parseInt(req.params.projectId) || 0;

      //check userid
      if (projectid <= 0) throw { message: "Project Id not found." };
      let result = await req
        .model("project")
        .getProject(projectid, req.objUser.u_id);

      if (result == null) {
        throw { message: "Project Id not found." };
      } else {
        res.send(result);
      }
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.insertProject = async (req, res, next) => {
    try {
      // Initialize Variable
      let userId = parseInt(req.objUser.u_id || 0);
      let title = (req.body.title || "").trim();
      let desc = (req.body.desc || "").trim();
      let deadline = (req.body.deadline || "").trim();
      let now = moment().format("YYYY-MM-DD HH:mm:ss");

      // Required Title
      if (validator.isEmpty(title)) throw { message: "Title is required." };

      // Validate Email Format
      if (validator.isEmpty(desc))
        throw { message: "Description is required." };

      let detailUser = await req.model("account").getUser(userId);
      // if customer not found, throw error
      if (detailUser == null) {
        // frontend must detect this error code and redirect to register page
        throw { message: "User not found." };
      }

      let data = [userId, title, desc, deadline, "1", now];

      let result = await req.model("project").createProject(data);

      res.send(result);
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.updateProject = async (req, res, next) => {
    try {
      // Initialize Variable
      let projectId = parseInt(req.params.projectId || 0);
      let title = (req.body.title || "").trim();
      let desc = (req.body.desc || "").trim();
      let deadline = (req.body.deadline || "").trim();
      let status = parseInt(req.body.status || 1);
      let now = moment().format("YYYY-MM-DD HH:mm:ss");

      // Required Title
      if (validator.isEmpty(title)) throw { message: "Title is required." };

      // Validate Email Format
      if (validator.isEmpty(desc))
        throw { message: "Description is required." };

      let detailProject = await req
        .model("project")
        .getProject(projectId, req.objUser.u_id);
      // if customer not found, throw error
      if (detailProject == null) {
        // frontend must detect this error code and redirect to register page
        throw { message: "Project not found." };
      }

      if (status < 0 || status > 1) throw { message: "Invalid status." };

      let data = [title, desc, deadline, status, now, projectId];

      let result = await req.model("project").updateProject(data);

      res.send(result);
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  return fn;
};

module.exports = obj;
