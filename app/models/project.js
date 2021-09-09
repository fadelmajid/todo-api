let projectModel = (db) => {
    // get tables name
    const tables = require('../../config/tables.json')
    
    const fn = {}

    // get all account
    fn.getAllProject = async (userid) => {
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "SELECT * FROM " + tables.main_project + " WHERE mp_u_fk = ?"

            // run query
            db.query(sql, [id], function (err, res) {
                if (err) return reject(err);
                return resolve(res);
            })
        })
        
    }

    fn.getProject = async (id, userid) => {
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "SELECT * FROM " + tables.main_project + " WHERE mp_id = ? AND mp_u_fk = ? LIMIT = 1"

            // run query
            db.query(sql, [id, userid], function (err, res) {
                if (err) return reject(err);
                return resolve(res[0]);
            })
        })
    }

    fn.createProject = async (data) =>{
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "INSERT INTO " + tables.account + "(mp_u_fk, mp_status, mp_title, mp_desc, mp_deadline, mp_photo, mp_created_at, mp_updated_at) VALUES (?)";

            // run query
            db.query(sql, [data], function (err, res) {
                if (err) return reject(err);
                return resolve({ status: 200, message: "Success" });
            })
        })
    }

    return fn
}

module.exports = projectModel