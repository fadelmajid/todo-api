'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const cst = require(rootpath + '/config/const.json')
    const config = require(rootpath + "/config/config.json")
    const fn = {}
    let moment = require('moment')
    const crypto = require('crypto')

    // BEGIN USER
    fn.getUser = async (id) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.user + " WHERE user_id = $1 LIMIT 1"

        let rows = await db.query(sql, [id])
        return rows.rows[0]
    }

    fn.getUserEmail = async (email) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.user + " WHERE user_email = $1 LIMIT 1"

        let row = await db.query(sql, [email])
        return row.rows[0]
    }

    fn.getUserPhone = async (phone) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.user + " WHERE user_phone = $1 ORDER BY user_id DESC LIMIT 1"

        let rows = await db.query(sql, [phone])
        return rows.rows[0]
    }

    fn.getUserCode = async (code) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.user + " WHERE user_code = $1 LIMIT 1"

        let rows = await db.query(sql, [code])
        return rows.rows[0]
    }

    fn.getAllUser = async (where = '', data = [], order_by = " user_id ASC ", limit = 0) => {
        let sql = "SELECT * FROM " + tbl.user + " WHERE 1=1 " + where + " ORDER BY " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.insertUser = async (data) => {
        let res = await objDB.insert(db, tbl.user, data, "user_id")
        return res
    }

    fn.updateUser = async (id, data) => {
        let where = {'cond': 'user_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.user, where, data)
    }

    fn.uploadImage = async (id, data) => {
        let where = {'cond': 'user_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.user, where, data)
    }

    fn.generateRefCode = (string) => {
        let moment = require('moment')
        const crypto = require('crypto')
        // notes : function untuk generate referral code per user
        const mili = moment().millisecond()
        const rstr = '_' + Math.random().toString(36).substr(2, 9)
        let unique = crypto.createHash('sha256').update(mili + string + rstr).digest("hex")
        return unique.substr(2, 6).toUpperCase()
    }

    fn.getUniqueCode = async (string) => {
        // generate & validate unik access token
        let referral_code = fn.generateRefCode(string)
        return referral_code
    }
    // END USER

    // START DATA
    fn.insertUserData = async (data) => {
        let res = await objDB.insert(db, tbl.user_data, data, "udata_id")
        return res
    }

    fn.getUserData = async (id) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.user_data + " WHERE udata_id = $1 AND is_deleted = false LIMIT 1"

        let rows = await db.query(sql, [id])
        return rows.rows[0]
    }

    fn.updateUserData = async (id, data) => {
        let where = {'cond': 'udata_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.user_data, where, data)
    }

    fn.deleteSoftUserData = async (id, data) => {
        let where = {'cond': 'udata_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.user_data, where, data)
    }

    fn.deleteUserData = async (id) => {
        let where = {"cond": "udata_id = $1", "bind": [id]}
        return await objDB.delete(db, tbl.user_data, where)
    }

    fn.getAllUserData = async (where = '', data = [], order_by = " udata_id ASC ", limit = 0) => {
        let sql = "SELECT * FROM " + tbl.user_data + " WHERE 1=1 " + where + " ORDER BY " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.getPagingUserData = async (where = '', data = [], order_by = " udata_id ASC ", page_no = 0, no_per_page = 0) => {
        let paging = loadLib('sanitize').pagingNumber(page_no, no_per_page)
        let sql = "SELECT user_data.* FROM " + tbl.user_data + " WHERE 1=1 " + where + " ORDER BY " + order_by
        let result = await objDB.getPaging(db, sql, data, paging.page_no, paging.no_per_page)
        return result
    }
    // END DATA


    // START SCHEDULE
    fn.insertUserTask = async (data) => {
        let res = await objDB.insert(db, tbl.task, data, "task_id")
        return res
    }

    fn.getUserTask = async (id) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.task + " WHERE task_id = $1 AND is_deleted = false LIMIT 1"

        let rows = await db.query(sql, [id])
        return rows.rows[0]
    }

    fn.updateUserTask = async (id, data) => {
        let where = {'cond': 'task_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.task, where, data)
    }

    fn.deleteSoftUserTask = async (id, data) => {
        let where = {'cond': 'task_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.task, where, data)
    }

    fn.deleteUserTask = async (id) => {
        let where = {"cond": "task_id = $1", "bind": [id]}
        return await objDB.delete(db, tbl.task, where)
    }

    fn.getAllUserTask = async (where = '', data = [], order_by = " task_id ASC ", limit = 0) => {
        let sql = "SELECT * FROM " + tbl.task + " WHERE 1=1 " + where + " ORDER BY " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.getPagingUserTask = async (where = '', data = [], order_by = " task_id ASC ", page_no = 0, no_per_page = 0) => {
        let paging = loadLib('sanitize').pagingNumber(page_no, no_per_page)
        let sql = "SELECT task.* FROM " + tbl.task + " WHERE 1=1 " + where + " ORDER BY " + order_by
        let result = await objDB.getPaging(db, sql, data, paging.page_no, paging.no_per_page)
        return result
    }
    // END DATA

    // BEGIN REGISTRATION
    fn.registration = async (data) => {
        let moment = require('moment')
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const authModel = require('./auth.js')(objDB, db, rootpath)
        const ltModel = require('./lock_transaction.js')(objDB, db, rootpath)
        const {name, email, phone, password, objToken} = data
        //BEGIN TRANSACTION
        await db.query('BEGIN')
        try{
            // create lock_transaction data
            await ltModel.insertRegister('Insert new user, name ' + name + ', email ' + email + ', phone' + phone)

            let data = {
                "user_name": name,
                "user_code": await fn.getUniqueCode(email),
                "user_email": email,
                "user_phone": phone,
                "user_password": password,
                "user_status": "active",
                "last_login": now,
                "created_date": now
            }
            let user_id = await fn.insertUser(data)
            let detailUser = await fn.getUser(user_id.user_id)

            // update column user_id in auth_token
            data = {
                "user_id": detailUser.user_id,
                "updated_date": now
            }
            await authModel.updateToken(objToken.atoken_id, data)

            //double validation, karena sering terjadi race condition
            let allUsers = await fn.getAllUser(" AND user_phone = $1 ", [phone])

            if(allUsers.length > 1) {
                throw getMessage('auth016')
            }

            //COMMIT
            await db.query('COMMIT')

            return detailUser
        }catch(e) {
            //ROLLBACK
            await db.query('ROLLBACK')
            throw e
        }
    }
    // END REGISTRATION

    //BEGIN LOGIN
    fn.login = async (data) => {
        let moment = require('moment')
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const authModel = require('./auth.js')(objDB, db, rootpath)
        const ltModel = require('./lock_transaction.js')(objDB, db, rootpath)
        const {detailUser, objToken} = data

        //BEGIN TRANSACTION
        await db.query('BEGIN')
        try{
            // create lock_transaction data
            await ltModel.insertLogin('Insert new user, name ' + detailUser.user_name + ', email ' + detailUser.user_email + ', phone' + detailUser.user_phone)

            // update column user_id in auth_token
            let tokenData = {
                "user_id": detailUser.user_id,
                "updated_date": now
            }
            await authModel.updateToken(objToken.atoken_id, tokenData)

            //INSERT IGNORE HISTORY TOKEN
            let insData = {
                "atoken_device": objToken.atoken_device,
                "atoken_platform": objToken.atoken_platform,
                "created_date": now
            }
            await authModel.insertHistoryToken(insData)
            // update last login
            await fn.updateUser(detailUser.user_id, {"last_login": now})

            //COMMIT
            await db.query('COMMIT')

            return true
        }catch(e) {
            //ROLLBACK
            await db.query('ROLLBACK')
            return false//return false supaya muncul pesan error general auth022
        }
    }
    //END LOGIN
    return fn
}

module.exports = obj
