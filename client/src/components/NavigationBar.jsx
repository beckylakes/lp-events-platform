import SearchBar from "./SearchBar";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import LogoutButton from "./LogoutButton";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const NavigationBar = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const isOrganiser = Array.isArray(auth.user?.roles)
    ? auth.user.roles.some((role) => role === 200)
    : typeof auth.user?.roles === "object"
    ? auth.user.roles.Organiser === 200
    : auth.user?.roles === 200;

    return (
      <nav>
        <SearchBar />
        <section className="nav-buttons">
          {auth?.user ? (
            <>
              <button onClick={() => navigate("/home")}>Home</button>
              {isOrganiser && (
                <>
                  <button onClick={() => navigate("/myevents")}>My events</button>
                  <button onClick={() => navigate("/create-event")}>
                    Create event
                  </button>
                </>
              )}
              <button onClick={() => navigate(`/user/${auth.user._id}`)}>
                My Account
              </button>
              <div className="account-button">
                <Link to={`/user/${auth.user._id}`} aria-label={`View profile of ${auth.user.username}`}>
                  <img
                    id="avatar"
                    src={auth.user.avatar}
                    alt={`${auth.user.username}'s avatar`}
                  />
                  <p>Welcome back, {auth.user.username}</p>
                </Link>
              </div>
              <LogoutButton />
            </>
          ) : (
            <>
              <button onClick={() => navigate("/home")}>Home</button>
              <LoginButton />
              <SignUpButton />
            </>
          )}
        </section>
      </nav>
    );
  };

export default NavigationBar;
