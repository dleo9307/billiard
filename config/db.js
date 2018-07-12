var mysql = require('mysql');

var pool = mysql.createPool({
        connectionLimit: 100,
        host     : 'sql10.freemysqlhosting.net',
        user     : 'sql10247219',
        password : '9Q3DiF2gby',
        database : 'sql10247219',
        dateStrings: 'date'
    });


exports.get = function() {
  return pool;
}