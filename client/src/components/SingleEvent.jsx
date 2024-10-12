import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { getEventById } from "../api/api";

const SingleEvent = () => {
  const { id, _id } = useParams();
  const { auth } = useContext(AuthContext);
  const [event, setEvent] = useState({});

  useEffect(() => {
      getEventById(id)
      .then((event) => {
        console.log(`Successfully got ${event.name} event`, event)
          setEvent(event)})
      .catch((err) => console.log(err));
  }, [id]);

  return event ? (
    <div>
      <h1>{event.name}</h1>
      <p>{event.info}</p>
    </div>
  ) : (
    <p>Loading event details...</p>
  );
};

export default SingleEvent;
