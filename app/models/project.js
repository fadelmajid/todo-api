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

    fn.getProject = async (id) => {
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "SELECT * FROM " + tables.main_project + " WHERE mp_id = ? LIMIT = 1"

            // run query
            db.query(sql, [id], function (err, res) {
                if (err) return reject(err);
                return resolve(res[0]);
            })
        })
    }

    fn.insertProject = (data) => {
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "INSERT INTO "+tables.main_project+"(mp_u_fk, mp_status, mp_title, mp_desc, mp_deadline, mp_created_at) VALUES (?)";
            
            // run query
            db.query(sql, [data], (err, res) => {
                if (err) return reject(err);
                return resolve({ status: 200, message: "Success" });
          });
        });
      };

    fn.updateProject = async (id, data) => {
        let where = {'cond' : 'mp_id = $1', 'bind': [id]}
        return await objDB.update(db, tables.main_project, where, data)
    }
    return fn
}

module.exports = projectModel