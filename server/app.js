const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get('/', (req, res, next) => {
    return res.status(200).send({"hello": "world!"})
});

module.exports = app;
