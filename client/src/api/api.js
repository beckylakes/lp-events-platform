import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090/api/",
});

export const getEvents = () => {
  return api.get("events").then(({ data }) => {
    return data.events;
  });
};

export const getTMEvents = () => {
  return api.get("ticketmaster/events").then(({ data }) => {
    return data.events;
  });
};

export const getAllEvents = () => {
  return Promise.all([getEvents(), getTMEvents()]).then(
    ([localEvents, tmEvents]) => {
// This is design choice => do I want to display all ticketmaster events, even if the data is slightly odd?
      const filteredLocalEvents = localEvents.filter(
        (event) => event.isExternal === false
      );
      const allEvents = [...filteredLocalEvents, ...tmEvents];

      const uniqueEvents = [];
      const eventNames = new Set();

      allEvents.forEach((event) => {
        if (!eventNames.has(event.name)) {
          eventNames.add(event.name);
          uniqueEvents.push(event);
        }
      });

      return uniqueEvents;
    }
  );
};

export const postUser = (username, email, password) => {
  return api.post("users", { username, email, password }).then(({ data }) => {
    console.log(data);
    return data;
  });
};

export const loginUser = (email, password) => {
  return api.post("users/login", { email, password }).then(({ data }) => {
    return data;
  });
};

export const getEventById = (id) => {
  if (id.length < 24) {
    return api.get(`ticketmaster/events/${id}`).then(({ data }) => {
      return data;
    });
  }

  return api.get(`events/${id}`).then(({ data }) => {
    return data.event;
  });
};

export const attendEvent = (userId, eventId) => {
  if (eventId.length < 24) {
    return api
      .post(`users/${userId}/ticketmaster/attend`, { eventId })
      .then((data) => {
        return data;
      })
      .catch((err) => console.log("TM event error", err));
  }

  return api
    .post(`users/${userId}/attend`, { eventId })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};
