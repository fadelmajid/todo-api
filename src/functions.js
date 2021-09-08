'use strict'

let fn = (fw) => {
    const path = require('path')
    const fn = {}

    fn.router = (param) => {
        const router = require('express').Router()

        param(fn, router)

        fw.use(router)
    }

    fn.route = (routeName) => {
        let routes = require("../app/routes/" + routeName)
        let authController = require('../app/controller/auth')()

        const router = require('express').Router()

        let routing = routes(fn)
        routing.forEach((el) => {

            let argsArray = []
            //push route path
            argsArray.push(el.route)

            //looping inits
            //middleware that will be execute before auth checking
            for (let i = 0, len = el.inits.length; i < len; i++) {
                argsArray.push(el.inits[i])
            }
            

            //looping middlewares
            for (let i = 0, len = el.middlewares.length; i < len; i++) {
                argsArray.push(el.middlewares[i])
            }
            router[el.method].apply(router, argsArray)
        })

        return router
    }

    return fn

}
module.exports = fn
