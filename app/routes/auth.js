"use strict";

module.exports = (app) => {
  const authController = require("../controller/auth")();

  let aRoutes = [
    {
      method: "get",
      route: "/get-token",
      inits: [],
      middlewares: [authController.getToken],
      auth: "no",
    },
    {
      method: "post",
      route: "/login",
      inits: [],
      middlewares: [authController.checkToken, authController.login],
      auth: "no",
    },
    {
      method: "post",
      route: "/logout",
      inits: [],
      middlewares: [authController.checkLogin, authController.logout],
      auth: "no",
    },
    {
      method: "post",
      route: "/register",
      inits: [],
      middlewares: [authController.checkToken, authController.register],
      auth: "no",
    },
    {
      method: "post",
      route: "/reset-password",
      inits: [],
      middlewares: [authController.checkToken, authController.resetPassword],
      auth: "no",
    },
    {
      method: "post",
      route: "/update-password",
      inits: [],
      middlewares: [authController.checkLogin, authController.updatePassword],
      auth: "no",
    },
  ];
  return aRoutes;
};
