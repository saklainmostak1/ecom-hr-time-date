var mysql = require('mysql');

var connections = mysql.createConnection({
  // host: 'localhost',
  //  host: '192.168.0.113',
  timezone: 'Z',
  port: '3306',
  user: 'root',
  password: '',
  database: 'hr_allowance'
});

// var connections = mysql.createConnection({
//   // host: 'localhost',
//   host: '162.0.239.48',
//   timezone: 'Z',
//   port: '3306',
//   user: "urbanit101_allowance",
//   database: "urbanit101_allowance",
//   password: "urb!n@!t!O!_@llO#!**w@nc=e"
// });

// var connections = mysql.createConnection({
//    host: '198.187.30.101',
//   port: '3306',
//   user: 'urbanit101_mern',
//   password: 'Urb@n!t101#_@merN',
//   database: 'urban101_mern'
// });

connections.query(function (error) {
  if (!!error) {
    console.log('connected')
    const data = "select * from 	module_info";
    connections.query(data, function (error, result) {
      console.log(result)
    })
  } else {
    console.log(error, 'Error')
  }
});

module.exports = connections