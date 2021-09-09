let projectModel = (db) => {
  // get tables name
  const tables = require("../../config/tables.json");

  const fn = {};

  // get all account
  fn.getAllProject = async (userid) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql = "SELECT * FROM " + tables.main_project + " WHERE mp_u_fk = ?";

      // run query
      db.query(sql, [userid], function (err, res) {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  };

  fn.getProject = async (id, userId) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "SELECT * FROM " +
        tables.main_project +
        " WHERE mp_id = ? AND mp_u_fk = ?";

      // run query
      db.query(sql, [id, userId], function (err, res) {
        if (err) return reject(err);
        return resolve(res[0]);
      });
    });
  };

  fn.createProject = async (data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "INSERT INTO " +
        tables.main_project +
        "(mp_u_fk, mp_title, mp_desc, mp_deadline, mp_status, mp_created_at) VALUES (?)";

      // run query
      db.query(sql, [data], function (err, res) {
        if (err) return reject(err);
        return resolve({ status: 200, message: "Success" });
      });
    });
  };

  fn.updateProject = async (data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "UPDATE " +
        tables.main_project +
        " SET mp_title = ?, mp_desc = ?, mp_deadline = ?, mp_status = ?, mp_updated_at = ? WHERE mp_id = ?";

      // run query
      db.query(
        sql,
        [data[0], data[1], data[2], data[3], data[4], data[5]],
        function (err, res) {
          if (err) return reject(err);
          return resolve({ status: 200, message: "Success" });
        }
      );
    });
  };

  return fn;
};

module.exports = projectModel;
