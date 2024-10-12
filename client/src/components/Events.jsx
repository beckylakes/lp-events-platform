import React, { useEffect, useState } from "react";
import { getAllEvents } from "../api/api";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";

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
            return (
              <Link to={`/events/${event._id}`}>
                <EventCard key={event._id} event={event} />{" "}
              </Link>
            );
          }
          if (event.id) {
            return (
              <Link to={`/events/${event.id}`}>
                <EventCard key={event.id} event={event} />
              </Link>
            );
          }
        })}
      </ul>
    </>
  );
};

export default Events;
