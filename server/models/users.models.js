const User = require("../db-models/userModel");

function selectAllUsers() {
  return User.find().then((result) => {
    return result;
  });
}

function selectUserById(id) {
  return User.findById(id).then((result) => {
    if(result === null){
        return Promise.reject({
            statusCode: 404,
            msg: "User Not Found"
        })
    }
    return result;
  });
}

module.exports = { selectAllUsers, selectUserById };
