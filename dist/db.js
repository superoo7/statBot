'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeQuery = undefined;

var _mssql = require('mssql');

var sql = _interopRequireWildcard(_mssql);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//Function to connect to database and execute query
var executeQuery = exports.executeQuery = function executeQuery(query) {
  var config = {
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    server: process.env.HOSTNAME,
    port: process.env.PORTNO,
    database: process.env.DATABASE
  };

  return new sql.ConnectionPool(config).connect().then(function (pool) {
    console.log('connected');
    return pool.request().query(query);
  }).then(function (result) {
    var rows = result.recordset;
    console.log(rows);
    sql.close();
    return rows;
  }).catch(function (err) {
    console.log(err);
    sql.close();
    return 'ERROR';
  });
};
//# sourceMappingURL=db.js.map