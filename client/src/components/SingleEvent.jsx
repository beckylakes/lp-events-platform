import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { getEventById } from "../api/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

dayjs.extend(utc);

const SingleEvent = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [event, setEvent] = useState({});
  const [attending, setAttending] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getEventById(id)
      .then((event) => {
        setEvent(event);

        if (!auth.user) {
          setAttending(false);
        } else if (event?.attendees?.includes(auth.user._id)) {
          setAttending(true);
        } else {
          setAttending(false);
        }
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.response.data.msg);
        navigate("/error", {
          state: {
            error: true,
            errorMessage: err.response.data.msg,
            errorCode: err.response.status,
          },
        });
      });
  }, [id, auth.user, navigate]);

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
      setError(false);
    } catch (err) {
      setError(true);
      setErrorMessage(err.response.data.msg);
      navigate("/error", {
        state: {
          error: true,
          errorMessage: err.response.data.msg,
          errorCode: err.response.status,
        },
      });
    }
  };

  const handleStopAttending = async () => {
    const event_id = event._id;
    const user_id = auth.user._id;

    try {event_id
      await axiosPrivate.post(`users/${user_id}/unattend`, { event_id });
      setAttending(false);
    } catch (err) {
      setError(true);
      setErrorMessage(err.response.data.msg);
      navigate("/error", {
        state: {
          error: true,
          errorMessage: err.response.data.msg,
          errorCode: err.response.status,
        },
      });
    }
  };

  const generateGoogleCalendarLink = (event) => {
    const startDate = dayjs(`${event.date}T${event.startTime}`)
      .utc()
      .format("YYYYMMDDTHHmmss[Z]");
    const endDate = event.endTime
      ? dayjs(`${event.date}T${event.endTime}`)
          .utc()
          .format("YYYYMMDDTHHmmss[Z]")
      : dayjs(`${event.date}T${event.startTime}`)
          .add(2, "hours")
          .utc()
          .format("YYYYMMDDTHHmmss[Z]");

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
  const eventImage =
    event && event.images && event.images.length > 0
      ? event.images[0]
      : "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return event ? (
    <div>
      <h1>{event.name}</h1>
      <img
        src={eventImage}
        alt={event.name}
        style={{ width: "100%", height: "auto" }}
      />
      <p>{eventDate}</p>
      <p>{event.location}</p>
      <p>{eventPrice}</p>
      <br />
      <p>{event.info}</p>
      {/* Here, I want to say which users are going to the event! */}
      {/* <p>{event.attendees.length}</p> */}
      {!attending ? (
        <button onClick={handleAttend}>Attend this event</button>
      ) : (
        <>
          <button onClick={handleStopAttending}>Stop Attending</button>
          <a
            href={generateGoogleCalendarLink(event)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Add to Google Calendar</button>
          </a>
        </>
      )}
    </div>
  ) : (
    <p>Loading event details...</p>
  );
};

export default SingleEvent;
