import { useState, useEffect } from "react";

const EventCard = ({ event }) => {
  const { name, info, images } = event
  
  return (
    <div>
      <h4>{name}</h4>
      <p>{info}</p>
    </div>
  );
};

export default EventCard;
