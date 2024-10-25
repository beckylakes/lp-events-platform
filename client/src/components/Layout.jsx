import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = ({ children }) => {
  const location = useLocation();
  const noHeaderPaths = ["/login", "/signup"];

  return (
    <main className="App">
      {!noHeaderPaths.includes(location.pathname) && <Header />}
      <section className="event-page">
        <Outlet />
      </section>
    </main>
  );
};

export default Layout;
