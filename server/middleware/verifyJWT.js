const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET;

function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send({ msg: "Unauthorised access" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).send({ msg: "No token provided" });

  jwt.verify(token, ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(403).send({ msg: "Invalid or expired token" });
    req.user = decoded.username;
    next();
  });
}

module.exports = verifyJWT;
