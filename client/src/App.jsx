import React, { useEffect, useState } from "react";
import { getAllEvents } from "./utils/api";
import EventCard from "./components/EventCard";

const App = () => {
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
          return <EventCard key={index} event={event} />;
        })}
      </ul>
    </>
  );
};

export default App;
