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
      const filteredLocalEvents = localEvents.filter(event => event.isExternal === false);

      // Combine local events and tmEvents
      const allEvents = [...filteredLocalEvents, ...tmEvents];

      // Use a Set to track event names and filter out duplicates
      const uniqueEvents = [];
      const eventNames = new Set();

      allEvents.forEach(event => {
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
  return api.get(`ticketmaster/events/${id}`).then(({ data }) => {
    return data;
  }).catch(() => {
    return api.get(`events/${id}`).then(({ data }) => {
      return data.event;
    });
  } )
};

export const attendEvent = (userId, eventId) => {
  return api.post(`users/${userId}/attend`, {eventId}).then((data) => {
    return data;
  }).catch(() => {
    return api.post(`users/${userId}/ticketmaster/attend`, {eventId}).then((data) => {console.log(data)})
  })
};
