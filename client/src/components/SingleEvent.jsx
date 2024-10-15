import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { getEventById, attendEvent } from "../api/api";
import dayjs from "dayjs"; // For formatting dates

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

      if(!auth.user){
        setAttending(false);
      } else if (event?.attendees?.includes(auth.user._id)) {
        setAttending(true);
      } else {
        setAttending(false);
      }
    });
  }, [id]);

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

  // Generate Google Calendar URL
  const generateGoogleCalendarLink = (event) => {
    const startDate = dayjs(event.date).format("YYYYMMDD");
    const startTime = event.startTime ? dayjs(event.startTime, "HH:mm").format("HHmm") : "0000";
    const endTime = event.endTime ? dayjs(event.endTime, "HH:mm").format("HHmm") : "2359";
    const endDate = dayjs(event.date).format("YYYYMMDD");

    const details = { 
      text: event.name,
      dates: `${startDate}T${startTime}/${endDate}T${endTime}`,
      details: event.info || "Event details",
      location: event.location || "Location not provided",
    };

    // Return the Google Calendar URL with the event details as query params
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      details.text
    )}&dates=${details.dates}&details=${encodeURIComponent(
      details.details
    )}&location=${encodeURIComponent(details.location)}&sf=true&output=xml`;
  };

  return event ? (
    <div>
      <h1>{event.name}</h1>
      <p>{event.info}</p>
      <button disabled={attending} onClick={handleAttend}>
        {attending ? "You are attending this event" : "Attend this event"}
      </button>
      {attending && (
        <a
          href={generateGoogleCalendarLink(event)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>Add to Google Calendar</button>
        </a>
      )}
    </div>
  ) : (
    <p>Loading event details...</p>
  );
};

export default SingleEvent;
