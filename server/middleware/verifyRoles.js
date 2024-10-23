function verifyRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.status(401).send({ msg: "Unauthorised access" });
    }

    const userRoles = Object.values(req.roles);

    const result = userRoles.some((role) => allowedRoles.includes(role));

    if (!result) {
      return res.status(401).send({ msg: "Unauthorised access" });
    }

    next();
  };
}

module.exports = verifyRoles;
