import React, { useEffect, useState } from "react";
import { getAllEvents } from "../api/api";
import EventCard from "./EventCard";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllEvents()
      .then((combinedEvents) => {
        setEvents(combinedEvents);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });
  }, []);

  return (
    <>
      <ul>
        {events.map((event, index) => {
          if (event._id) {
            return <EventCard key={event._id} event={event} />;
          }
          if (event.id) {
            return <EventCard key={event.id} event={event} />;
          }
        })}
      </ul>
    </>
  );
};

export default Events;
