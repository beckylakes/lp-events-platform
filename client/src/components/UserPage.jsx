import { useEffect, useState } from "react";
import { getEventById, getUserById } from "../api/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import EventCard from "./EventCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const UserPage = () => {
  const { user_id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { auth, updateAuthUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [loadingRoleChange, setLoadingRoleChange] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(user_id);
        setUser(response);
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

    fetchUser();
  }, [user_id]);

  useEffect(() => {
    if (user && user.attendingEvents && user.attendingEvents.length > 0) {
      Promise.all(
        user.attendingEvents.map((eventId) => getEventById(eventId))
      ).then((events) => {
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
      setUser(updatedUser.data.user);
      updateAuthUser(updatedUser.data.user)
      setLoadingRoleChange(false);
    } catch (err) {
      setError(true);
      setErrorMessage(err.response.data.msg);
      setLoadingRoleChange(false);
      navigate("/error", {
        state: {
          error: true,
          errorMessage: err.response.data.msg,
          errorCode: err.response.status,
        },
      });
    }
  };

  const canEditRoles = auth?.user?._id === user?._id;
  const isOrganiser = auth.user?.roles?.Organiser === 200 || user?.roles?.Organiser === 200

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{user.username}'s page</h1>
      <img src={user.avatar}/>
      <p>Since: {new Date(user.createdAt).toDateString()}</p>

      {canEditRoles && (
        <>
          <button onClick={handleRoleChange} disabled={loadingRoleChange}>
            {loadingRoleChange
              ? "Updating..."
              : user.roles?.Organiser === 200
              ? "Stop being an Event Organiser"
              : "Become an Event Organiser"}
          </button>
          {isOrganiser && (
            <button onClick={() => navigate("/myevents")}>My Events</button>
          )}
        </>
      )}

      <br />
      <h3>Events {user.username} is attending:</h3>
      <ul>
        {attendingEvents.length > 0 ? (
          attendingEvents.map((event) => (
            <EventCard event={event} key={event._id} id={event._id} />
          ))
        ) : (
          <p>
            None yet - want to <Link to={"/home"}>check out more events?</Link>
          </p>
        )}
      </ul>
    </>
  );
};

export default UserPage;
