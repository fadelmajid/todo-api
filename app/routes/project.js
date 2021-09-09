"use strict";

module.exports = (app) => {
  const projectController = require("../controller/project")();
  const authController = require("../controller/auth")();

  let pRoutes = [
    {
      method: "get",
      route: "/get-all",
      inits: [],
      middlewares: [authController.checkLogin, projectController.getAllProject],
      auth: "login",
    },
    {
      method: "post",
      route: "/",
      inits: [],
      middlewares: [authController.checkLogin, projectController.insertProject],
      auth: "no",
    },
    {
      method: "get",
      route: "/:projectId",
      inits: [],
      middlewares: [authController.checkLogin, projectController.getProject],
      auth: "login",
    },
    {
      method: "put",
      route: "/:projectId",
      inits: [],
      middlewares: [authController.checkLogin, projectController.updateProject],
      auth: "login",
    },
  ];
  return pRoutes;
};
