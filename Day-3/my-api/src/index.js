require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.json({ message: "Server is running Vam-C" }));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));