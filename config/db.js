var mysql = require('mysql');

var pool = mysql.createPool({
        connectionLimit: 100,
        host     : 'us-cdbr-iron-east-04.cleardb.net',
        user     : 'bfd5ff18f9f31d',
        password : 'ad2388b9',
        database : 'heroku_fba3ee939ab66f8',
        dateStrings: 'date'
    });


exports.get = function() {
  return pool;
}