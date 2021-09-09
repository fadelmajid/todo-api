let accountModel = (db) => {
  // get tables name
  const tables = require("../../config/tables.json");
  const moment = require("moment");
  const now = moment().format("YYYY-MM-DD HH:mm:ss");
  const md5 = require("md5");

  const fn = {};

  // get all account
  fn.getAllUsers = async (id) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql = "SELECT * FROM " + tables.account;

      // run query
      db.query(sql, [id], function (err, res) {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  };

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

  fn.getUserEmail = async (email) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql = "SELECT * FROM " + tables.account + " WHERE u_email = ?";

      // run query
      db.query(sql, [email], (err, res) => {
        if (err) return reject(err);
        return resolve(res[0]);
      });
    });
  };

  fn.insertUser = (data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "INSERT INTO " +
        tables.account +
        "(u_email, u_password, u_full_name, u_role, u_created_at, u_status) VALUES (?)";

      // run query
      db.query(sql, [data], (err, res) => {
        if (err) return reject(err);
        return resolve({ status: 200, message: "Success" });
      });
    });
  };

  fn.updateUser = async (id, data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "UPDATE " + tables.account + " SET u_last_login = ? WHERE u_id = ?";

      // run query
      db.query(sql, [data, id], function (err, res) {
        if (err) return reject(false);
        return resolve(true);
      });
    });
  };

  fn.updateLogout = async (id, data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "UPDATE " + tables.account + " SET u_last_logout = ? WHERE u_id = ?";

      // run query
      db.query(sql, [data, id], function (err, res) {
        if (err) return reject(false);
        return resolve(true);
      });
    });
  };

  fn.login = async (data) => {
    const { detailUser, objToken } = data;
    let auth = require("../models/auth")(db);

    try {
      await auth.updateToken(detailUser.u_id, now, objToken.atoken_id);
      await fn.updateUser(detailUser.u_id, now);
      return true;
    } catch (e) {
      return false;
    }
  };

  fn.generatePassword = () => {
    const mili = moment().millisecond();
    const rstr = "_" + Math.random().toString(36).substr(2, 9);
    return md5(mili + rstr).substr(0, 8);
  };

  fn.resetPassword = (data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "UPDATE " + tables.account + " SET u_password = ? WHERE u_id = ?";

      // run query
      db.query(sql, [data.newPass, data.detailUser], (err, res) => {
        if (err) return reject(false);
        return resolve(true);
      });
    });
  };

  fn.updatePassword = async (data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "UPDATE " + tables.account + " SET u_password = ? WHERE u_id = ?";

      // run query
      db.query(sql, [data.newPass, data.id], function (err, res) {
        if (err) return reject(false);
        return resolve(true);
      });
    });
  };

  fn.updateUserStatus = async (id) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "UPDATE " +
        tables.account +
        " SET u_status = 'inactive' WHERE u_id = ?";

      // run query
      db.query(sql, [id], function (err, res) {
        if (err)
          return reject({
            status: 400,
            message: "Oops sorry, something went wrong!",
          });
        return resolve({ status: 200, message: "Delete Account Successful" });
      });
    });
  };

  return fn;
};

module.exports = accountModel;
