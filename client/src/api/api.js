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
      return [...localEvents, ...tmEvents];
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
    if(data.errors){
      return api.get(`events/${id}`).then(({data}) => {
        return data.event
      })
    }
    return data;
  });
};
