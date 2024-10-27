import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const CreateEvent = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [eventData, setEventData] = useState({
    name: "",
    info: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    price: 0,
    tags: "",
    images: [],
  });

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "images") {
      const imageArray = value.split(",").map((image) => image.trim());
      setEventData((prevData) => ({ ...prevData, images: imageArray }));
    } else {
      setEventData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedTags = eventData.tags.split(",").map((tag) => tag.trim());

    try {
      const response = await axiosPrivate.post("/events", {
        ...eventData,
        tags: formattedTags,
        createdBy: auth?.user._id,
      });
      alert("Successfully created an event");
      navigate("/myevents");
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

  return (
    <section className="create-event-form">
      <h2>Create Event</h2>
      {error && <p aria-live="polite">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          value={eventData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="info">Info:</label>
        <textarea
          name="info"
          value={eventData.info}
          onChange={handleChange}
          required
        />

        <label htmlFor="location">Location:</label>
        <input
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="start time">Start Time:</label>
        <input
          type="time"
          name="startTime"
          value={eventData.startTime}
          onChange={handleChange}
          required
        />

        <label htmlFor="end time">End Time:</label>
        <input
          type="time"
          name="endTime"
          value={eventData.endTime}
          onChange={handleChange}
        />

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          name="price"
          value={eventData.price}
          onChange={handleChange}
          min="0"
        />

        <label htmlFor="tags">Tags (separate each tag with a ','):</label>
        <input
          type="text"
          name="tags"
          value={eventData.tags}
          onChange={handleChange}
        />

        <label htmlFor="images">Images (separate each URL with a ','):</label>
        <input
          type="text"
          name="images"
          value={eventData.images}
          onChange={handleChange}
        />

        <button type="submit">Create Event</button>
      </form>
    </section>
  );
};

export default CreateEvent;
