'use strict'

module.exports = (app) => {
    const projectController = require("../controller/project")()

    let pRoutes = [
        { method: 'get', route: '/userid', inits: [], middlewares: [projectController.getAllProject], auth: 'login' },
        // {method: 'post', route: '/', inits: [], middlewares: [projectController.createProject], auth: 'no'},
        { method: 'get', route: '/:projectid', inits: [], middlewares: [projectController.getProject], auth: 'login' },
    ]
    return pRoutes
}

