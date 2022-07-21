const mysql = require("mysql")
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:  "user_mgmt_db",
    port: 3306
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connection established !");
})

module.exports.con = con;