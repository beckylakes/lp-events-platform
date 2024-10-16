import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import SingleEvent from "./components/SingleEvent";
import UserPage from "./components/UserPage";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Unauthorised from "./components/Unauthorised";
import PersistLogin from "./components/PersistLogin";

const App = () => {
  const location = useLocation();
  const noHeaderPaths = ["/login", "/signup"];

  return (
    <main className="App">
      {/* {!noHeaderPaths.includes(location.pathname) && <Header />} */}
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<PersistLogin />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/events/:id" element={<SingleEvent />} />
            <Route path="/user/:user_id" element={<UserPage />} />
            <Route path="/unauthorised" element={<Unauthorised />} />

            {/* protected routes */}
            {/* <Route element={<RequireAuth allowedRoles={[100, 200]} />}>
              <Route path="/user/:user_id/settings" />
            </Route>
            <Route element={<RequireAuth allowedRoles={[200]} />}>
              <Route path="/myevents" />
              {/* My Events route - here you can edit, make, delete events you made*/}
            {/* </Route> */} 
          </Route>

          {/* catch all */}
          {/* <Route path="*" element={<404 Error Page Cannot find>}/> */}
        </Route>
      </Routes>
    </main>
  );
};

export default App;
