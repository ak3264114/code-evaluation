const db = require("../db.connection");

var Submission = function (codeSnippet) {
	this.username = codeSnippet.username;
	this.language = codeSnippet.language;
	this.stdin = codeSnippet.stdin;
	this.code = codeSnippet.code;
	this.submittedAt = codeSnippet.submittedAt;
};

Submission.create = function (newCode, result) {
	console.log("working 1");
	db.query("INSERT INTO code_snippets SET ?", newCode, () => {
		if (err) {
			console.error("Error on submission:", err);
			result(err, null);
		} else {
			console.log("Inserted submission with ID:", res.insertId);
			console.log("working 1");
			result(null, res.insertId);
		}
	});
};

module.exports = Submission;
