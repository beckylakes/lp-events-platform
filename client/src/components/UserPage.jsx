import React, { useEffect, useState } from "react";
import { getEventById, getUserById, updateUserRole } from "../api/api";
import { Link, useParams } from "react-router-dom";
import EventCard from "./EventCard";

const UserPage = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [loadingRoleChange, setLoadingRoleChange] = useState(false);

  useEffect(() => {
    getUserById(user_id).then((response) => {
      console.log(response)
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

  const handleRoleChange = async () => {
    setLoadingRoleChange(true);
    const newRole = user.role === "member" ? "staff" : "member"; // Toggle role

    try {
      const updatedUser = await updateUserRole(user._id, newRole);
      setUser(updatedUser);
      setLoadingRoleChange(false);
    } catch (error) {
      console.log("Error updating role:", error);
      setLoadingRoleChange(false);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>My Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Created: {user.createdAt}</p>

      {/* Button to change role */}
      <button onClick={handleRoleChange} disabled={loadingRoleChange}>
        {loadingRoleChange
          ? "Updating..."
          : user.role === "member"
          ? "Change to normal member"
          : "Become an Event Organiser"}
      </button>

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
