'use strict'

module.exports = (app) => {
    const adminController = require("../controller/admin")()

    let aRoutes = [
        { method: 'get', route: '/', inits: [], middlewares: [adminController.getAllUsers], auth: 'yes' },
        { method: 'get', route: '/:id', inits: [], middlewares: [adminController.getUser], auth: 'yes' },
    ]
    return aRoutes
}

