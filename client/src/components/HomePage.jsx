import Events from "./Events";

const HomePage = () => {
  return (
    <div>
      <img
        className="banner"
        src="https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      <h3>Upcoming Events:</h3>
      <Events />
    </div>
  );
};

export default HomePage;
