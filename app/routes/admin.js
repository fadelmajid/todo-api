"use strict";

module.exports = (app) => {
  const adminController = require("../controller/admin")();
  const authController = require("../controller/auth")();

  let aRoutes = [
    {
      method: "get",
      route: "/",
      inits: [],
      middlewares: [
        authController.checkLogin,
        adminController.checkAdmin,
        adminController.getAllUsers,
      ],
      auth: "yes",
    },
    {
      method: "get",
      route: "/:id",
      inits: [],
      middlewares: [
        authController.checkLogin,
        adminController.checkAdmin,
        adminController.getUser,
      ],
      auth: "yes",
    },
    {
      method: "get",
      route: "/:id/inactive",
      inits: [],
      middlewares: [
        authController.checkLogin,
        adminController.checkAdmin,
        adminController.softDelete,
      ],
      auth: "yes",
    },
  ];
  return aRoutes;
};
