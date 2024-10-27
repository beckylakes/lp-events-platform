import { useEffect, useState } from "react";
import { getAllEvents } from "../api/api";
import EventCard from "./EventCard";

const Events = () => {
  const [events, setEvents] = useState([]);
  
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEvents()
      .then((allEvents) => {
        setEvents(allEvents);
        setLoading(false);
        setError(false)
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.response.data.msg)
        setLoading(false);
        navigate("/error", {
          state: {
            error: true,
            errorMessage: err.response.data.msg,
            errorCode: err.response.status,
          },
        });
      });
  }, []);

  if (loading) return <div className="loading-page">Loading...</div>;

  return (
    <>
      <ul className="event-card-container">
        {events.map((event) => {
          const id = event._id || event.id;
          return <EventCard event={event} id={id} key={id} />;
        })}
      </ul>
    </>
  );
};

export default Events;
