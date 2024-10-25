require("dotenv").config();
const {
  selectAllEvents,
  selectEventById,
  updateEvent,
  insertEvent,
  deleteEvent,
  selectTMEventById,
  findTMEventById,
} = require("../models/events.models.js");
const { selectUserById, findUsersByEvent, updateUserEvents } = require("../models/users.models.js");

const API_KEY = process.env.API_KEY;

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
  const {
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
  } = req.body;

  return insertEvent(
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
  )
    .then((event) => {
      return selectUserById(event.createdBy).then((user) => {
        if (!user.createdEvents.includes(event._id)) {
          user.createdEvents.push(event._id);
          return user.save().then(() => {
            res.status(201).send({ event });
          });
        } else {
          res.status(201).send({ event });
        }
      });
    })
    .catch((err) => {
      next(err);
    });
  }
  
  async function deleteEventByID(req, res, next) {
    const { event_id } = req.params;
    
    try {
      await deleteEvent(event_id);
      
      const users = await findUsersByEvent(event_id);
      const updatePromises = users.map(async (user) => {
        const updateData = {};
        
        if (user.createdEvents.includes(event_id)) {
          updateData.$pull = { createdEvents: event_id };
        }
        
        if (user.attendingEvents.includes(event_id)) {
          updateData.$pull = { attendingEvents: event_id };
        }
        
      return updateUserEvents(user._id, updateData);
    });

    await Promise.all(updatePromises);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

function getTMEvents(req, res, next) {
  return fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=${API_KEY}`
  )
    .then((response) => {
      const data = response.json();
      return data.then(({ _embedded }) => {
        res.status(200).send(_embedded);
      });
    })
    .catch((err) => {
      next(err);
    });
}

function getTMEventById(req, res, next) {
  const { event_id } = req.params;

  return fetch(
    `https://app.ticketmaster.com/discovery/v2/events/${event_id}.json?apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((ticketmasterEvent) => {
      if (
        ticketmasterEvent.errors &&
        ticketmasterEvent.errors.length > 0 &&
        ticketmasterEvent.errors[0].code === "DIS1004"
      ) {
        return res.status(404).send({ msg: "Event not found" });
      }
      return findTMEventById(
        { ticketmasterId: event_id },
        ticketmasterEvent
      ).then((event) => {
        res.status(200).send(event);
      });
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
  getTMEvents,
  getTMEventById,
};
