"use strict"

let obj = () => {
    const md5 = require("md5");
    const moment = require("moment");
    const validator = require("validator");

    const fn = {}

    fn.getAllUsers = async (req, res, next) => {
        try {
            let result = await req.model('account').getAllUsers();
            res.send(result);
        } catch (e) {
            res.send({ status: 400, message: "Oops sorry, something went wrong!" });
        }
    };

    fn.getUser = async (req, res, next) => {
        try {
            let result = await req.model('account').getUser(req.params.id);
            res.send(result);
        } catch (e) {
            res.send(Object.assign({ status: 400 }, e));
        }
    };



    return fn
}

module.exports = obj
