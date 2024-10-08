import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";

const App = () => {
  const location = useLocation();
  const noHeaderPaths = ["/login", "/signup"]


  return (
    <>
      {!noHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* <Route path="/user/mytickets" element={<TicketsPage />} /> */}
      </Routes>
    </>
  );
};

export default App;
