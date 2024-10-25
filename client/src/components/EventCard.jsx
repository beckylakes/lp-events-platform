import { Link } from "react-router-dom";

const EventCard = ({ event, id }) => {
  const {
    name,
    info,
    images,
    location,
    price,
    dates,
    date,
    _embedded,
    priceRanges,
    attendees
  } = event;

  const imageUrl =
    images && images.length > 0 && images[0] !== ''
      ? typeof images[0] === "string"
        ? images[0]
        : images[0]?.url
      : "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  const eventStartTime = date ? date : dates?.start?.localDate;
  const eventLocation = location ? location : _embedded?.venues?.[0]?.name;
  const eventPrice = price !== undefined ? price : priceRanges?.[0]?.min;

  return (
    <div className="event-card">
      <Link to={`/events/${id}`}>
        <h4>{name}</h4>
        <img
          src={imageUrl}
          alt={name}
          style={{ width: "100%", height: "auto" }}
        />
      </Link>
      <p>{eventStartTime ? new Date(eventStartTime).toDateString() : "N/A"}</p>
      <p>{eventLocation || "N/A"}</p>
      <p>
        {eventPrice !== undefined && eventPrice !== 0
          ? `£${eventPrice}`
          : "Free"}
      </p>
</div>
  );
};

export default EventCard;
