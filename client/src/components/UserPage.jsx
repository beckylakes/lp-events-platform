import React, { useEffect, useState } from "react";
import {
  axiosPrivate,
  getEventById,
  getUserById,
  updateUserRole,
} from "../api/api";
import { useParams } from "react-router-dom";
import EventCard from "./EventCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserPage = () => {
  const { user_id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [user, setUser] = useState(null);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [loadingRoleChange, setLoadingRoleChange] = useState(false);

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

  const handleRoleChange = async () => {
    setLoadingRoleChange(true);

    const hasOrganiserRole = user.roles?.Organiser === 200;

    const updatedRoles = {
      ...user.roles,
      Organiser: hasOrganiserRole ? undefined : 200,
    };

    const filteredRoles = Object.fromEntries(
      Object.entries(updatedRoles).filter(([_, value]) => value !== undefined)
    );

    try {
      const updatedUser = await axiosPrivate.patch(`users/${user_id}`, {
        roles: filteredRoles,
      });

      setUser(updatedUser.data);
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
          : user.roles?.Organiser === 200
          ? "Stop being an Event Organiser"
          : "Become an Event Organiser"}
      </button>

      <p>Events I'm attending:</p>
      <ul>
        {attendingEvents.length > 0 ? (
          attendingEvents.map((event) => (
            <EventCard event={event} key={event._id} id={event._id} />
          ))
        ) : (
          <p>No events yet</p>
        )}
      </ul>
    </>
  );
};

export default UserPage;
