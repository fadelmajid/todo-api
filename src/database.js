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

    return db
}

module.exports = database

