const EventCard = ({ event }) => {
  const { name, info, images } = event
  return (
    <li>
      <h4>{name}</h4>
      <p>{info}</p>
    </li>
  );
};

export default EventCard;
