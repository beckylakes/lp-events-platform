import React, { useEffect, useState } from "react";
import { getAllEvents } from "../api/api";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const localEventsResponse = await axiosPrivate.get("events");
        const localEvents = localEventsResponse.data.events;

        const tmEventsResponse = await axiosPrivate.get("ticketmaster/events");
        const tmEvents = tmEventsResponse.data.events;

        // This is design choice => do I want to display all ticketmaster events, even if the data is slightly odd?
        const filteredLocalEvents = localEvents.filter(
          (event) => !event.isExternal
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
        setEvents(uniqueEvents);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };

    // Call the function to fetch events
    getEvents();
  }, []);
  return (
    <>
      <ul>
        {events.map((event) => {
          const id = event._id || event.id;
          return (
            <Link to={`/events/${id}`} key={id}>
              <EventCard event={event} />
            </Link>
          );
        })}
      </ul>
    </>
  );
};

export default Events;
