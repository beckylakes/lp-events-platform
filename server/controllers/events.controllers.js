const {
  selectAllEvents,
  selectEventById,
  updateEvent,
  insertEvent,
  deleteEvent
} = require("../models/events.models.js");

function getEvents(req, res, next) {
  return selectAllEvents()
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch((err) => {
      next(err);
    });
}

function getEventById(req, res, next) {
  const { event_id } = req.params;
  return selectEventById(event_id)
    .then((event) => {
      res.status(200).send({ event });
    })
    .catch((err) => {
      next(err);
    });
}

function patchEvent(req, res, next) {
  const { event_id } = req.params;
  const newBody = req.body;
  return updateEvent(event_id, newBody)
    .then((event) => {
      res.status(200).send({ event });
    })
    .catch((err) => {
      next(err);
    });
}

function postEvent(req, res, next) {
  const new_event = req.body;
  return insertEvent(new_event)
    .then((event) => {
      res.status(201).send({ event });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteEventByID(req, res, next) {
  const { event_id } = req.params;
  return deleteEvent(event_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getEvents,
  getEventById,
  patchEvent,
  postEvent,
  deleteEventByID,
};
