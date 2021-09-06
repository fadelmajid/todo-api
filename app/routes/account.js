'use strict'

module.exports = (app) => {
    const accountController = require("../controller/account")()

    let aRoutes = [
        {method: 'get', route: '/', inits: [], middlewares: [accountController.getAllUsers], auth: 'no'},
        {method: 'post', route: '/', inits: [], middlewares: [accountController.insertUser], auth: 'no'},
        {method: 'get', route: '/:id', inits: [], middlewares: [accountController.getUser], auth: 'no'},
    ]
    return aRoutes
}

