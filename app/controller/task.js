"use strict";

let obj = () => {
  const md5 = require("md5");
  const moment = require("moment");
  const validator = require("validator");
  const getMessage = require("../../src/errors");

  const fn = {};

  fn.getAllTask = async (req, res, next) => {
    try {
      let projectId = parseInt(req.body.projectId) || 0;

      //check projectId
      if (projectId <= 0) throw { message: "Project not found." };
      let detailProject = await req
        .model("project")
        .getProject(projectId, req.objUser.u_id);
      if (detailProject == null) {
        // frontend must detect this error code and redirect to register page
        throw { message: "Project not found." };
      }

      let result = await req
        .model("task")
        .getAllTask(projectId, req.objUser.u_id);

      if (result.length == 0) {
        throw { message: "Empty Task." };
      } else {
        res.send(result);
      }
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.getTask = async (req, res, next) => {
    try {
      let taskId = parseInt(req.params.taskId) || 0;

      //check userid
      if (taskId <= 0) throw { message: "Task not found." };
      let result = await req.model("task").getTask(taskId, req.objUser.u_id);

      if (result == null) {
        throw { message: "Task not found." };
      } else {
        res.send(result);
      }
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.insertTask = async (req, res, next) => {
    try {
      // Initialize Variable
      let userId = parseInt(req.objUser.u_id || 0);
      let projectId = parseInt(req.body.projectId || 0);
      let title = (req.body.title || "").trim();
      let desc = (req.body.desc || "").trim();
      let deadline = (req.body.deadline || "").trim();
      let now = moment().format("YYYY-MM-DD HH:mm:ss");

      if (projectId <= 0) throw { message: "Project not found." };
      let detailProject = await req
        .model("project")
        .getProject(projectId, userId);
      if (detailProject == null) {
        // frontend must detect this error code and redirect to register page
        throw { message: "Project not found." };
      }

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

      let data = [projectId, title, desc, deadline, "1", now, userId];

      let result = await req.model("task").createTask(data);

      res.send(result);
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  fn.updateTask = async (req, res, next) => {
    try {
      // Initialize Variable
      let taskId = parseInt(req.params.taskId || 0);
      let projectId = parseInt(req.body.projectId || 0);
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

      let detailTask = await req
        .model("task")
        .getTask(taskId, req.objUser.u_id);
      // if customer not found, throw error
      if (detailTask == null) {
        // frontend must detect this error code and redirect to register page
        throw { message: "Task not found." };
      }

      if (status < 0 || status > 1) throw { message: "Invalid status." };

      let data = [title, desc, deadline, status, now, taskId, req.objUser.u_id];

      let result = await req.model("task").updateTask(data);

      res.send(result);
    } catch (e) {
      res.send(Object.assign({ status: 400 }, e));
    }
  };

  return fn;
};

module.exports = obj;
