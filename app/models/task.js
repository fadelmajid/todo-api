let taskModel = (db) => {
    // get tables name
    const tables = require('../../config/tables.json')
    
    const fn = {}

    // get all account
    fn.getAllTasks = async (projectid) => {
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "SELECT * FROM " + tables.task + " WHERE t_mp_fk = ?"

            // run query
            db.query(sql, [projectid], function (err, res) {
                if (err) return reject(err);
                return resolve(res);
            })
        })
        
    }

    fn.getTask = async (id) => {
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "SELECT * FROM " + tables.task + " WHERE t_id = ? LIMIT = 1"

            // run query
            db.query(sql, [id], function (err, res) {
                if (err) return reject(err);
                return resolve(res[0]);
            })
        })
    }

    fn.createTask = async (data) =>{
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "INSERT INTO "+tables.account+"(t_mp_fk, t_status, t_deadline, t_title, t_desc, t_created_at, t_updated_at) VALUES (?)";

            // run query
            db.query(sql, [data], function (err, res) {
                if (err) return reject(err);
                return resolve({ status: 200, message: "Success" });
            })
        })
    }

    return fn
}

module.exports = accountModel