import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { getEventById, attendEvent } from "../api/api";

const SingleEvent = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [event, setEvent] = useState({});
  const [attending, setAttending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getEventById(id).then((event) => {
      console.log(`Successfully got ${event.name} event`, event);
      setEvent(event);

      if (event?.attendees?.includes(auth.user._id)) {
        setAttending(true);
      } else {
        setAttending(false);
      }
    });
  }, [id, auth.user._id]);

  const handleAttend = () => {
    if (!auth?.user) {
      alert("Please login in to attend an event");
      navigate("/login");
      return;
    }

    const eventId = event._id;
    const userId = auth.user._id;

    attendEvent(userId, eventId)
      .then((res) => {
        setAttending(true);
        console.log("Event added to attending list:", res);
      })
      .catch((err) => console.log(err));
  };

  return event ? (
    <div>
      <h1>{event.name}</h1>
      <p>{event.info}</p>
      <button disabled={attending} onClick={handleAttend}>
        {attending ? "You are attending this event" : "Attend this event"}
      </button>
    </div>
  ) : (
    <p>Loading event details...</p>
  );
};

export default SingleEvent;
