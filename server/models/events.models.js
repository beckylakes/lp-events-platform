const mongoose = require("mongoose");
const Event = require("../db-models/eventModel.js");

function selectAllEvents() {
  return Event.find().then((result) => {
    return result;
  });
}

function selectEventById(event_id, user) {
  console.log(event_id)
  if (!mongoose.Types.ObjectId.isValid(event_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad Request",
      user: user
    });
  }

  return Event.findById(event_id).then((result) => {
    if (result === null) {
      return Promise.reject({
        statusCode: 404,
        msg: "Event Not Found",
      });
    }
    return result;
  });
}

function updateEvent(event_id, body) {
  if (!mongoose.Types.ObjectId.isValid(event_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad Request",
    });
  }

  return Event.findByIdAndUpdate(event_id, body).then(() => {
    return selectEventById(event_id);
  });
}

function insertEvent(new_event) {
  return Event.create(new_event).then((result) => {
    return result;
  });
}

function deleteEvent(event_id) {
  if (!mongoose.Types.ObjectId.isValid(event_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad Request",
    });
  }

  return Event.findByIdAndDelete(event_id).then((result) => {
    if (result === null) {
      return Promise.reject({
        statusCode: 404,
        msg: "Event Not Found",
      });
    }
    return result;
  });
}

module.exports = {
  selectAllEvents,
  selectEventById,
  updateEvent,
  insertEvent,
  deleteEvent,
};
