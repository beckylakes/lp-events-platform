import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const CreateEvent = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [eventData, setEventData] = useState({
    name: '',
    info: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    price: 0,
    tags: '',
    images: [],
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "images") {
      const imageArray = value.split(',').map((image) => image.trim());
      setEventData((prevData) => ({ ...prevData, images: imageArray }));
    } else {
      setEventData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedTags = eventData.tags.split(',').map((tag) => tag.trim());
  
    try {
      const response = await axiosPrivate.post('/events', {
        ...eventData,
        tags: formattedTags,
        createdBy: auth?.user._id
      });

      console.log('Event created:', response.data);
      navigate('/myevents'); 
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Info:</label>
          <textarea
            name="info"
            value={eventData.info}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Start Time:</label>
          <input
            type="time"
            name="startTime"
            value={eventData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>End Time:</label>
          <input
            type="time"
            name="endTime"
            value={eventData.endTime}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={eventData.price}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div>
          <label>Tags (separate each tag with a ','):</label>
          <input
            type="text"
            name="tags"
            value={eventData.tags}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Images (separate each URL with a ','):</label>
          <input
            type="text"
            name="images"
            value={eventData.images}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
