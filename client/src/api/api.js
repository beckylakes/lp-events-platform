import axios from "axios";

export const api = axios.create({
  baseURL: "https://eventure-4z44.onrender.com/api/",
});

export const axiosPrivate = axios.create({
  baseURL: "https://eventure-4z44.onrender.com/api/",
  headers: {'Content-Type': 'application/json'},
  withCredentials: true,
})


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
    return data;
  });
};

export const loginUser = (email, password) => {
  return api
    .post("users/login", { email, password }, { withCredentials: true })
    .then(({ data }) => {
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

export const getUserById = (user_id) => {
  return api
    .get(`users/${user_id}`)
    .then(({ data }) => {
      return data.user;
    });
};

export const updateUserRole = (user_id, newRole) => {
  return api.patch(`users/:${user_id}`).then((data) => {
    return data.user;
  });
};

export const refreshToken = () => {
  return api
    .post("users/refresh", {}, { withCredentials: true })
    .then(({ data }) => {
      return data;
    });
};
