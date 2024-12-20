const mongoose = require("mongoose");
const Event = require("../schemas/eventSchema.js");
const { selectUserById } = require("./users.models.js");

function selectAllEvents() {
  return Event.find().then((result) => {
    return result;
  });
}

function selectEventById(event_id, user) {
  if (!mongoose.Types.ObjectId.isValid(event_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad request",
      user: user,
    });
  }

  return Event.findById(event_id).then((result) => {
    if (result === null) {
      return Promise.reject({
        statusCode: 404,
        msg: "Event not found",
      });
    }
    return result;
  });
}

function updateEvent(event_id, body) {
  if (!mongoose.Types.ObjectId.isValid(event_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad request",
    });
  }

  return Event.findByIdAndUpdate(event_id, body).then(() => {
    return selectEventById(event_id);
  });
}

function insertEvent(
  name,
  info,
  location,
  date,
  startTime,
  endTime,
  price,
  tags,
  images,
  createdBy
) {
  const newEvent = {
    name,
    info,
    location,
    date,
    startTime,
    endTime,
    price,
    tags,
    images,
    createdBy,
  };

  return Event.create(newEvent).then((result) => {
    return result;
  });
}

function insertTMEvent(new_event) {
  return selectTMEventById(new_event.ticketmasterId).then(() => {
    return Event.create(new_event).then((result) => {
      return result;
    });
  });
}

function deleteEvent(event_id) {
  if (!mongoose.Types.ObjectId.isValid(event_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad request",
    });
  }

  return Event.findByIdAndDelete(event_id).then((result) => {
    if (result === null) {
      return Promise.reject({
        statusCode: 404,
        msg: "Event not found",
      });
    }
    return result;
  });
}

function selectTMEventById(ticketmasterId) {
  return Event.find({ ticketmasterId: ticketmasterId }).then((result) => {
    if (result.length >= 1) {
      return Promise.reject({
        statusCode: 400,
        msg: "Event already exists",
      });
    }
    return result[0];
  });
}

function findTMEventById(ticketmasterId, event) {
  return Event.find(ticketmasterId).then((result) => {
    if (result.length >= 1) {
      return result[0];
    }
    if (result.length === 0) {
      const newEvent = {
        name: event.name,
        info: event.info || "No info available",
        location: event._embedded?.venues[0]?.name || "Unknown",
        date: event.dates.start.localDate || null,
        startTime: event.dates.start.localTime || null,
        endTime: event.dates.end?.localTime || null,
        createdBy: null,
        price: event.priceRanges?.[0]?.min || 0,
        attendees: [],
        isPaid: event.priceRanges?.[0]?.min > 0 || false,
        tags:
          event.classifications?.map(
            (classification) => classification.segment.name
          ) || [],
        images: event.images?.map((img) => img.url) || [],
        isExternal: true,
        ticketmasterId: ticketmasterId.ticketmasterId,
        url: event.url,
      };

      return insertTMEvent(newEvent).then((newTMEvent) => {
        return newTMEvent;
      });
    }
    return result[0];
  });
}

function updateEventAttendees(user_id, event_id) {
  if (!mongoose.Types.ObjectId.isValid(event_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad request",
    });
  }
  return Event.findByIdAndUpdate(event_id, {$pull: {attendees: user_id}})
}

module.exports = {
  selectAllEvents,
  selectEventById,
  updateEvent,
  insertEvent,
  deleteEvent,
  selectTMEventById,
  findTMEventById,
  insertTMEvent,
  updateEventAttendees
};
