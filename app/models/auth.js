let authModel = (db) => {
  // get tables name
  const tables = require("../../config/tables.json");
  const moment = require("moment");
  const now = moment().format("YYYY-MM-DD HH:mm:ss");
  const md5 = require("md5");

  const fn = {};

  fn.getValidAccessToken = async (access_token) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "SELECT * FROM " +
        tables.auth_token +
        " WHERE atoken_access = ? AND atoken_status = ? AND expired_date > ? LIMIT 1";

      // run query
      db.query(sql, [access_token, "active", now], function (err, res) {
        if (err) return reject(err);
        return resolve(res[0]);
      });
    });
  };

  fn.getToken = async (device_id, platform) => {
    // set existing token to inactive
    await fn.setTokenInactive(device_id);

    // generate & validate unik access token
    let access_token = fn.generateToken("access");

    // generate & validate unik refresh token
    let refresh_token = fn.generateToken("refresh");

    // insert new token
    let data = [
      0,
      0,
      device_id,
      platform,
      access_token,
      "active",
      refresh_token,
      moment().add(24, "hours").format("YYYY-MM-DD HH:mm:ss"),
      now,
      now,
    ];
    let atoken_id = await fn.insertToken(data);

    // return 1 row of customer token
    return await fn.getCustomerToken(atoken_id);
  };

  fn.getCustomerToken = async (id) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "SELECT * FROM " + tables.auth_token + " WHERE atoken_id = ? LIMIT 1";

      // run query
      db.query(sql, [id], function (err, res) {
        if (err) return reject(err);
        return resolve(res[0]);
      });
    });
  };

  fn.setTokenInactive = async (device_id) => {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    // prepare query
    let sql =
      "UPDATE " +
      tables.auth_token +
      " SET atoken_status = ?, updated_date = ? WHERE atoken_device = ? AND atoken_status = ? AND created_date < ?";

    // run query
    await db.query(
      sql,
      ["inactive", now, device_id, "active", now],
      function (err, res) {
        if (err) return false;
        return true;
      }
    );
  };

  fn.setCurrentTokenInactive = async (device_id) => {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    // prepare query
    let sql =
      "UPDATE " +
      tables.auth_token +
      " SET atoken_status = ?, updated_date = ? WHERE atoken_device = ? AND atoken_status = ?";

    // run query
    await db.query(
      sql,
      ["inactive", now, device_id, "active"],
      function (err, res) {
        if (err) return false;
        return true;
      }
    );
  };

  fn.insertToken = async (data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql = "INSERT INTO " + tables.auth_token + " VALUES (?)";

      // run query
      db.query(sql, [data], function (err, res) {
        if (err) return reject(err);
        return resolve(res.insertId);
      });
    });
  };

  fn.updateToken = async (id, date, now) => {
    // prepare query
    let sql =
      "UPDATE " +
      tables.auth_token +
      " SET customer_id = ?, updated_date = ? WHERE atoken_id = ?";

    // run query
    db.query(sql, [id, date, now], function (err, res) {
      if (err) return err;
    });
  };

  fn.generateToken = (string) => {
    const mili = moment().millisecond();
    const rstr = "_" + Math.random().toString(36).substr(2, 9);
    return md5(mili + string + rstr);
  };

  return fn;
};

module.exports = authModel;
