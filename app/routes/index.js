"use strict";

module.exports = (app, router) => {
  const mainController = require("../controller/main")();

  router.get("/", mainController.index);
  router.use("/account", app.route("account"));
  router.use("/project", app.route("project"));
  router.use("/task", app.route("task"));
  router.use("/auth", app.route("auth"));
};
