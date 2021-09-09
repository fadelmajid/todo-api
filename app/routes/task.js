"use strict";

module.exports = (app) => {
  const taskController = require("../controller/task")();
  const authController = require("../controller/auth")();

  let pRoutes = [
    {
      method: "get",
      route: "/get-all",
      inits: [],
      middlewares: [authController.checkLogin, taskController.getAllTask],
      auth: "login",
    },
    {
      method: "post",
      route: "/",
      inits: [],
      middlewares: [authController.checkLogin, taskController.insertTask],
      auth: "no",
    },
    {
      method: "get",
      route: "/:taskId",
      inits: [],
      middlewares: [authController.checkLogin, taskController.getTask],
      auth: "login",
    },
    {
      method: "put",
      route: "/:taskId",
      inits: [],
      middlewares: [authController.checkLogin, taskController.updateTask],
      auth: "login",
    },
  ];
  return pRoutes;
};
