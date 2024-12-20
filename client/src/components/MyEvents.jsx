import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { getEventById, getUserById } from "../api/api";

const MyEvents = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [myEvents, setMyEvents] = useState([]);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await getUserById(auth.user._id);
          const createdEventsIds = response.createdEvents;

          const eventDetailsPromises = createdEventsIds.map((eventId) =>
            getEventById(eventId)
          );
          const events = await Promise.all(eventDetailsPromises);

          setMyEvents(events);
          setLoading(false);
    
      } catch (error) {
        setLoading(false);
        setError(true);
        setErrorMessage(error.response.data.msg);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await axiosPrivate.delete(`events/${eventId}`);
      setMyEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
      alert("Successfully deleted event");
    } catch (error) {
      setError(true);
      setErrorMessage(error.response.data.msg);
      navigate("/error", {
        state: {
          error: true,
          errorMessage: err.response.data.msg,
          errorCode: err.response.status,
        },
      });
    }
  };

  if (loading) {
    return <p className="loading-page">Loading...</p>;
  }

  return (
    <section className="my-events-page">
      <h2>My Events</h2>
      {myEvents && myEvents.length === 0 ? (
        <article>
          <p>You have not created any events yet</p>

          <p>
            Would you like to <Link to="/create-event">make one?</Link>
          </p>
        </article>
      ) : (
        <ul className="my-events-container">
          {myEvents.map((event) => (
            <div className="event-card-wrapper" key={event._id}>
              <EventCard event={event} id={event._id} key={event._id} />
              <button
                onClick={() => {
                  handleDelete(event._id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </ul>
      )}
      <button
        onClick={() => navigate("/create-event")}
        className="create-event-btn"
      >
        Create Event +
      </button>
    </section >
  );
};

export default MyEvents;
