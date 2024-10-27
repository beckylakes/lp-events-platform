import Events from "./Events";

const HomePage = () => {
  return (
    <section className="home-page">
      <img
        className="banner"
        src="https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Crowd cheering with arms in the air at live music shoe with band performing in the distance"
      />
      <h2>Upcoming Events:</h2>
      <Events />
    </section>
  );
};

export default HomePage;
