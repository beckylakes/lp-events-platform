import React, { useEffect, useState } from "react";
import { getAllEvents } from "../api/api";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllEvents().then((allEvents) => {
      setEvents(allEvents)
      setLoading(false)
    }).catch((err) => {
        setError(err)
        setLoading(false)
    })
  }, []);

  if(loading) return <p>Loading...</p>

  return (
    <>
      <ul>
        {events.map((event) => {
          const id = event._id || event.id;
          return (
              <EventCard event={event} id={id} key={id}/>
          );
        })}
      </ul>
    </>
  );
};

export default Events;
