'use strict'

let database = () =>{ 
    const db = {}
    
    db.connect = async () =>{
        // get database configuration
        var config = require('../config/credentials.json')

        // create connection
        var mysql      = require('mysql')

        var connection = mysql.createPool({
        host     : config.database.host,
        user     : config.database.user,
        password : config.database.password,
        database : config.database.database
        })

        // connect to database

        return connection
    }
    
    db.insert = async (conn, tblname, data, id_name) => {
        // validate data
        if(typeof data !== 'object') {
            throw getMessage('dbins001')
        }

        // prepare var
        let cols = ""
        let vals = ""
        let count = 0
        let binding = []
        for (let prop in data) {
            count++
            if (!data.hasOwnProperty(prop)) {
                //The current property is not a direct property of p
                continue
            }
            cols += prop + ","
            vals += "$"+count+","
            binding.push(data[prop])
        }
        if(cols == '' || vals == '') {
            throw getMessage('dbins002')
        }else{
            cols = cols.slice(0, -1)
            vals = vals.slice(0, -1)
        }

        let sql = "INSERT INTO " + tblname + "(" + cols + ") VALUES (" + vals + ") returning " + id_name 
        let result = await conn.query(sql, binding)
        return result.rows[0]
    }


    db.update = async (conn, tblname, where, data) => {
        // validate data
        if(typeof data !== 'object') {
            throw getMessage('dbupd001')
        }
        if(typeof where !== 'object') {
            throw getMessage('dbupd002')
        }else if(where.cond === undefined) {
            throw getMessage('dbupd003')
        }else if(where.cond == '') {
            throw getMessage('dbupd004')
        }

        let count = 0
        let binding = []
        //let where = {"cond": "test_id = ? ", "bind": [id]}
        if(where.bind !== undefined && typeof where.bind == 'object') {
            for(let i = 0, len = where.bind.length; i < len; i++) {
                count++
                binding.push(where.bind[i])
            }
        }

        // prepare var
        let setcond = ""
        for (let prop in data) {
            count++
            if (!data.hasOwnProperty(prop)) {
                //The current property is not a direct property of p
                continue
            }
            setcond += prop + " = $"+count+","
            binding.push(data[prop])
        }
        if(setcond == '') {
            throw getMessage('dbupd005')
        }else{
            setcond = setcond.slice(0, -1)
        }


        let sql = "UPDATE " + tblname + " SET " + setcond + " WHERE " + where.cond

        return await conn.query(sql, binding)
    }


    db.delete = async (conn, tblname, where) => {
        // validate data
        if(typeof where !== 'object') {
            throw getMessage('dbdel001')
        }else if(where.cond === undefined) {
            throw getMessage('dbdel002')
        }else if(where.cond == '') {
            throw getMessage('dbdel003')
        }

        let binding = []
        //let where = {"cond": "test_id = ? ", "bind": [id]}
        if(where.bind !== undefined && typeof where.bind == 'object') {
            for(let i = 0, len = where.bind.length; i < len; i++) {
                binding.push(where.bind[i])
            }
        }

        let sql = "DELETE FROM " + tblname + " WHERE " + where.cond
        return await conn.query(sql, binding)
    }

    return db
}

module.exports = database

