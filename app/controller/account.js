"use strict"

let obj = () =>{
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

    fn.insertUser = async (req, res, next) => {
    try {
        // Initialize Variable
        let email = (req.body.email || "").trim().toLowerCase();
        let password = (req.body.password || "").trim();
        let role = parseInt((req.body.role || 0).trim());
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        let name = (req.body.name || "").trim();

        // Required Email
        if (validator.isEmpty(email))
        throw { message: "Email Address is required." };

        // Validate Email Format
        if (!validator.isEmail(email)) throw { message: "Invalid Email Address." };

        // Required Password
        if (validator.isEmpty(password)) throw { message: "Password is required." };

        // Validate Role
        // 0 : User
        // 1 : Admin
        if (role < 0 || role > 1) throw { message: "Invalid Role." };

        let data = [email, md5(password), name, role, now];

        let result = await req.model('account').insertUser(data);

        res.send(result);
    } catch (e) {
        res.send(Object.assign({ status: 400 }, e));
    }
    }

    return fn
}

module.exports = obj
