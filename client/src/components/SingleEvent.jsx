import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { getEventById, getUserById } from "../api/api";
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
  const [user, setUser] = useState({});
  const [attending, setAttending] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getEventById(id)
      .then((event) => {
        setEvent(event);
        setAttending(auth.user && event?.attendees?.includes(auth.user._id));
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

  useEffect(() => {
    if (event.createdBy) {
      getUserById(event.createdBy)
        .then((response) => setUser(response))
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
    }
  }, [event]);

  const handleAttend = async () => {
    if (!auth?.user) {
      alert("Please login to attend an event");
      navigate("/login");
    }
    const { _id: eventId } = event;
    const { _id: userId } = auth.user;

    try {
      const endpoint = eventId.length < 24
        ? `users/${userId}/ticketmaster/attend`
        : `users/${userId}/attend`;
      await axiosPrivate.post(endpoint, { eventId });
      setAttending(true);
    } catch (err) {
      navigate("/error", {
        state: {
          error: true,
          errorMessage: err.response?.data?.msg || "Error attending event",
          errorCode: err.response?.status || 500,
        },
      });
    }
  };

  const handleStopAttending = async () => {
    try {
      await axiosPrivate.post(`users/${auth.user._id}/unattend`, {
        event_id: event._id,
      });
      setAttending(false);
    } catch (err) {
      navigate("/error", {
        state: {
          error: true,
          errorMessage: err.response?.data?.msg || "Error stopping attendance",
          errorCode: err.response?.status || 500,
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

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      event.info || "Event details not provided"
    )}&location=${encodeURIComponent(
      event.location || "Location not provided"
    )}&sf=true&output=xml`;
  };

  const eventPrice = event.price !== 0 ? `£${event.price}` : "Free";
  const eventDate = new Date(event.date).toDateString();
  const eventImage =
    event?.images?.[0] ||
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return event ? (
    <section className="event-container">
      <h1 className="event-title">{event.name}</h1>
      <img className="event-image" src={eventImage} alt={event.name} />

      {event.createdBy ? (
        <p className="event-creator">
          By <Link to={`/user/${event.createdBy}`}>{user.username}</Link>
          <img className="user-avatar" src={user.avatar} alt="User Avatar" />
        </p>
      ) : (
        <p>
          <a href={event.url} target="_blank" rel="noopener noreferrer">
            Go to Ticketmaster
          </a>
        </p>
      )}

      <p className="event-date">{eventDate}</p>
      <p className="event-location">{event.location}</p>
      <p className="event-price">{eventPrice}</p>
      <p className="event-info">{event.info}</p>

      <section className="event-actions">
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
      </section>
    </section>
  ) : (
    <p>Loading event details...</p>
  );
};

export default SingleEvent;