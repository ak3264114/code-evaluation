const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const taskRoutes = require("./routes/route");
const cors = require("cors");

app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 8000;

app.use("", taskRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
