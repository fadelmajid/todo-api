"use strict";

module.exports = (app, router) => {
  const mainController = require("../controller/main")();

  router.get("/", mainController.index);
  router.use("/admin", app.route("admin"));
  router.use("/project", app.route("project"));
  router.use("/task", app.route("task"));
  router.use("/auth", app.route("auth"));
};
