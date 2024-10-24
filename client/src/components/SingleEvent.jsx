import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { getEventById } from "../api/api"; 
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

dayjs.extend(utc); // Extend dayjs with UTC plugin

const SingleEvent = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [event, setEvent] = useState({});
  const [attending, setAttending] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getEventById(id).then((event) => {
      console.log(`Successfully got ${event.name} event`, event);
      setEvent(event);

      if (!auth.user) {
        setAttending(false);
      } else if (event?.attendees?.includes(auth.user._id)) {
        setAttending(true);
      } else {
        setAttending(false);
      }
    });
  }, [id]);

  const handleAttend = async () => {
    if (!auth?.user) {
      alert("Please login in to attend an event");
      navigate("/login");
      return;
    }

    const eventId = event._id;
    const userId = auth.user._id;

    try {
      let result;

      if (eventId.length < 24) {
        result = await axiosPrivate.post(
          `users/${userId}/ticketmaster/attend`,
          { eventId }
        );
      } else {
        result = await axiosPrivate.post(`users/${userId}/attend`, { eventId });
      }

      setAttending(true);
      console.log("Event added to attending list:", result);
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  // Generate Google Calendar URL
  const generateGoogleCalendarLink = (event) => {
    const startDate = dayjs(`${event.date}T${event.startTime}`).utc().format("YYYYMMDDTHHmmss[Z]");
    const endDate = event.endTime
      ? dayjs(`${event.date}T${event.endTime}`).utc().format("YYYYMMDDTHHmmss[Z]")
      : dayjs(`${event.date}T${event.startTime}`).add(2, "hours").utc().format("YYYYMMDDTHHmmss[Z]"); // Default to 2 hours if no end time

    const details = {
      text: event.name,
      dates: `${startDate}/${endDate}`,
      details: event.info || "Event details not provided",
      location: event.location || "Location not provided",
    };

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      details.text
    )}&dates=${details.dates}&details=${encodeURIComponent(
      details.details
    )}&location=${encodeURIComponent(details.location)}&sf=true&output=xml`;
  };

  const eventPrice = event.price !== 0 ? `£${event.price}` : "Free";
  const eventDate = new Date(event.date).toDateString();

  return event && event.images !== undefined ? (
    <div>
      <h1>{event.name}</h1>
      <img src={event.images[0]} alt={event.name} style={{ width: "100%", height: "auto" }} />
      <p>{eventDate}</p>
      <p>{event.location}</p>
      <p>{eventPrice}</p>
      <br />
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
