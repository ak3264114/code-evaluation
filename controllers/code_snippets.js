const { sendResponse } = require("../utils/response");
const db = require("../db.connection");
const { default: axios } = require("axios");

const addData = async (req, res) => {
	try {
		const { username, language, stdin, code } = req.body;

		if (!username || !language || !code) {
			return sendResponse(res, 400, false, "Invalid Request", {});
		}
		const response = await axios.post(
			"https://judge0-ce.p.rapidapi.com/submissions",
			{ source_code: code, language_id: language, stdin: stdin },
			{
				params: {
					base64_encoded: "true",
					fields: "*",
				},
				headers: {
					"content-type": "application/json",
					"X-RapidAPI-Key": process.env.RAPID_API_KEY,
					"X-RapidAPI-Host": process.env.RAPID_API_HOST,
				},
			},
		);

		const { token } = await response.data;

		const insertQuery = `INSERT INTO code_snippets (username,  token) VALUES (?, ?)`;
		db.query(insertQuery, [username, token], (err, result) => {
			if (err) {
				throw new Error("Failed to submit code snippet to the database.");
			}

			return sendResponse(
				res,
				200,
				false,
				"Code snippet submitted successfully and compiled.",
				{ token },
			);
		});
	} catch (error) {
		console.error("Error in addData function:", error);
		sendResponse(res, 500, true, error.message);
	}
};

const processExecutionData = async (req, res) => {
	const executionId = req.params.executionId;
	try {
		const selectQuery = `SELECT username FROM code_snippets WHERE token = ?`;
		db.query(selectQuery, [executionId], async (err, rows) => {
			if (err) {
				console.error("Error fetching execution data from the database:", err);
				res.status(500).json({
					error: true,
					message: "Failed to fetch execution data from the database.",
				});
				return;
			}

			if (rows.length === 0) {
				console.log("No execution data found for the given execution ID.");
				res.status(404).json({
					error: true,
					message: "No execution data found for the given execution ID.",
				});
				return;
			}

			const { username } = rows[0];

			const response = await axios.get(
				`https://judge0-ce.p.rapidapi.com/submissions/${executionId}`,

				{
					params: {
						base64_encoded: "false",
						fields: "*",
					},
					headers: {
						"content-type": "application/json",
						"X-RapidAPI-Key": process.env.RAPID_API_KEY,
						"X-RapidAPI-Host": process.env.RAPID_API_HOST,
					},
				},
			);

			const { source_code, stdin, stdout, created_at, language } =
				await response.data;

			const updateQuery = `UPDATE code_snippets 
                         SET language = ?, stdin = ?, code = ?,submittedAt =? ,  Execution_data = ?
                         WHERE username = ? AND token = ?`;
			db.query(
				updateQuery,
				[
					language.name,
					stdin,
					source_code,
					created_at,
					stdout,
					username,
					executionId,
				],
				(err) => {
					if (err) {
						console.error("Error adding code snippet to the database:", err);
						res.status(500).json({
							error: true,
							message: "Failed to add code snippet to the database.",
						});
						return;
					}

					console.log("Code snippet added to the database successfully.");
					res.status(200).json({
						error: false,
						message: "Code snippet added to the database successfully.",
					});
				},
			);
		});
	} catch (error) {
		console.error("Error processing execution data:", error);
		return res
			.status(500)
			.json({ error: true, message: "Error processing execution data." });
	}
};

const fetchData = (req, res) => {
	const username = req.params.username;

	const selectQuery = "SELECT * FROM code_snippets where username =  ?";
	db.query(selectQuery, [username], (err, result) => {
		if (err) {
			sendResponse(res, 500, true, "Failed to fetch data from the database.");
			return;
		}

		sendResponse(res, 200, false, "Data fetched from MySQL database.", result);
	});
};
module.exports = { addData, processExecutionData, fetchData };
