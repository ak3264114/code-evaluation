const mysql = require("mysql");

const db = mysql.createConnection({
	host: "database-2.cdyacicia234.us-west-2.rds.amazonaws.com",
	user: "admin",
	password: "admin123",
	database: "test",
	port: "3306",
});

db.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL database:", err);
		return;
	}
	console.log("Connected to MySQL database...");
});

module.exports = db;
