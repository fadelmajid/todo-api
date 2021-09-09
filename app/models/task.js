let taskModel = (db) => {
  const tables = require("../../config/tables.json");

  const fn = {};

  // get all account
  fn.getAllTask = async (projectid, userid) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "SELECT * FROM " + tables.task + " WHERE t_mp_fk = ? AND t_u_id = ?";

      // run query
      db.query(sql, [projectid, userid], function (err, res) {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  };

  fn.getTask = async (id, userId) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "SELECT * FROM " + tables.task + " WHERE t_id = ? AND t_u_id = ?";

      // run query
      db.query(sql, [id, userId], function (err, res) {
        if (err) return reject(err);
        return resolve(res[0]);
      });
    });
  };

  fn.createTask = async (data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "INSERT INTO " +
        tables.task +
        "(t_mp_fk, t_title, t_desc, t_deadline, t_status, t_created_at, t_u_id) VALUES (?)";

      // run query
      db.query(sql, [data], function (err, res) {
        if (err) return reject(err);
        return resolve({ status: 200, message: "Success" });
      });
    });
  };

  fn.updateTask = async (data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "UPDATE " +
        tables.task +
        " SET t_title = ?, t_desc = ?, t_deadline = ?, t_status = ?, t_updated_at = ? WHERE t_id = ? AND t_u_id = ?";

      // run query
      db.query(
        sql,
        [data[0], data[1], data[2], data[3], data[4], data[5], data[6]],
        function (err, res) {
          if (err) return reject(err);
          return resolve({ status: 200, message: "Success" });
        }
      );
    });
  };

  return fn;
};

module.exports = taskModel;
