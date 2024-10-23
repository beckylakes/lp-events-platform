import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const MyEvents = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await axiosPrivate.get(
          `user/${auth.user._id}/myevents`
        );
        setMyEvents(response.data);
      } catch (error) {
        console.error("Error fetching user's events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <div>
      <h2>My Events</h2>
      {myEvents.length === 0 ? (
        <>
          <p>You have not created any events yet</p>

          <p>
            Would you like to <Link to="/create-event">make one?</Link>
          </p>
        </>
      ) : (
        <ul>
          {myEvents.map((event) => (
            <li key={event._id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => navigate("/create-event")}
        className="create-event-btn"
      >
        Create Event +
      </button>
    </div>
  );
};

export default MyEvents;
