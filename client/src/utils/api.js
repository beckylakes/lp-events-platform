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
