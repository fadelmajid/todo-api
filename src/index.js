"use strict"

let src = (fw, rootpath) => {
    let $initialize = false

    const path = require("path")

    // extend response
    require("./middlewares/response")(fw)

    // load  middlewares
    require("./middlewares/index")(fw, rootpath)

    // load functions
    let fn = require("./functions.js")(fw)

    // load database
    let objDB = require("./database")()

    fw.use(async (req, res, next) => {
        try {
            req.db = await objDB.connect()
            req.model = (filename) => {
                return require("../app/models/" + filename)(req.db)
            }
            next()
        } catch(e) {
            next(e)
        }
    })

    // error handler
    fw.use((err, req, res, next) => {
        res.error(err)
    })

    return fn;
}

module.exports = src