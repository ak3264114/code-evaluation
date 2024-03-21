const mysql = require("mysql");

const db = mysql.createConnection({
	host: process.env.MYSQL_HOST_NAME,
	user:process.env.MYSQL_USER ,
	password: process.env.MYSQL_PASSWORD,
	port:  process.env.MYSQL_PORT,
});

db.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL database:", err);
		return;
	}
	console.log("Connected to MySQL database...");
});

module.exports = db;
