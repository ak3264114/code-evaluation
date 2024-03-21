exports.sendResponse = (res, status, error, message, data = null) => {
	res.status(status).json({ error, message, data });
};
