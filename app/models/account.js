let accountModel = (objDB, db) => {
    // get tables name
    const tables = require('../../config/tables.json')
    
    const fn = {}

    // get all account
    fn.getAllUsers = async (id) => {
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "SELECT * FROM " + tables.account

            // run query
            db.query(sql, [id], function (err, res) {
                if (err) return reject(err);
                return resolve(res);
            })
        })
        
    }

    fn.getUser = async (id) => {
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "SELECT * FROM " + tables.account + " WHERE u_id = ?";
            
            // run query
            db.query(sql, [parseInt(id)], (err, res) => {
                if (err) return reject(err);
                return resolve(res[0]);
            });
        });
      };
      
    fn.insertUser = (data) => {
        return new Promise((resolve, reject) => {
            // prepare query
            let sql = "INSERT INTO "+tables.account+"(u_email, u_password, u_name, u_role, u_created_at) VALUES (?)";
            
            // run query
            db.query(sql, [data], (err, res) => {
                if (err) return reject(err);
                return resolve({ status: 200, message: "Success" });
          });
        });
      };
    
    return fn
}

module.exports = accountModel