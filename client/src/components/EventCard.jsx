import { useState, useEffect } from "react";

const EventCard = ({ event }) => {
  const { name, info, images } = event
  console.log(images)
  return (
    <li>
      <p>{name}</p>
      <p>{info}</p>
    </li>
  );
};

export default EventCard;
