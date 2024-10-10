import { useState, useEffect } from "react";

const EventCard = ({ event }) => {
  const { name, info, images } = event
  
  return (
    <li>
      <p>{name}</p>
      <p>{info}</p>
    </li>
  );
};

export default EventCard;
