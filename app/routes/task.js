'use strict'

module.exports = (app) => {
    const taskController = require("../controller/task")()

    let pRoutes = [
        { method: 'get', route: '/:projectid', inits: [], middlewares: [taskController.getAllTasks], auth: 'login' },
        // {method: 'post', route: '/', inits: [], middlewares: [projectController.createTask], auth: 'no'},
        { method: 'get', route: '/:taskid', inits: [], middlewares: [taskController.getTask], auth: 'login' },
    ]
    return pRoutes
}

