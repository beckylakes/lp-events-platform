function verifyRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req?.roles) return res.status(401).send({ msg: "Unauthorized" });
    
    const userRoles = Object.values(req.roles);

    const result = userRoles.some((role) => allowedRoles.includes(role));

    if (!result) return res.status(401).send({ msg: "Unauthorized" });

    next();
  };
}

module.exports = verifyRoles;