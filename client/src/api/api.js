import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9090/api/",
});

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:9090/api/",
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

export const logoutUser = () => {
  return api
    .post("users/logout", {}, { withCredentials: true })
    .then((data) => {
      console.log(data);
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
      });
  }

  return api.post(`users/${userId}/attend`, { eventId }).then((data) => {
    return data;
  });
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const getUserById = (user_id) => {
  return api
    .get(`users/${user_id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${getCookie("jwt")}` },
    })
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
