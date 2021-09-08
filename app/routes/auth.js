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
      middlewares: [authController.checkToken],
      auth: "no",
    },
    {
      method: "post",
      route: "/logout",
      inits: [],
      middlewares: [authController.checkLogin],
      auth: "no",
    },
    {
      method: 'post',
      route: '/register',
      inits: [],
      middlewares: [authController.checkTokenAndRegister],
      auth: 'no'
    },

  ];
  return aRoutes;
};
