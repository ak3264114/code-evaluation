const express = require("express");
const {
	addData,
	processExecutionData,
	fetchData,
} = require("../controllers/code_snippets");

const router = express.Router();

router.post("/", addData);
router.post("/:executionId", processExecutionData);
router.get("/:username", fetchData);

module.exports = router;
