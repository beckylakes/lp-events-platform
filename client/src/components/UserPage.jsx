import React, { useEffect, useState } from "react";
import { getEventById, getUserById } from "../api/api";
import { Link, useParams } from "react-router-dom";
import EventCard from "./EventCard";

const UserPage = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [attendingEvents, setAttendingEvents] = useState([]);

  useEffect(() => {
    getUserById(user_id).then((response) => {
      setUser(response);
    });
  }, [user_id]);

  useEffect(() => {
    if (user && user.attendingEvents && user.attendingEvents.length > 0) {
      Promise.all(
        user.attendingEvents.map((eventId) => getEventById(eventId))
      ).then((events) => {
        console.log("Got events attended by user", events);
        setAttendingEvents(events);
      });
    }
  }, [user]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>My Profile</h2>
      <p>Events I'm attending:</p>
      <ul>
        {attendingEvents.length > 0 ? (
          attendingEvents.map((event) => (
            <Link to={`/events/${event._id}`} key={event._id}>
              <EventCard event={event} />
            </Link>
          ))
        ) : (
          <p>No events yet</p>
        )}
      </ul>
    </>
  );
};

export default UserPage;
