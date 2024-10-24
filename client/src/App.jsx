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
import Error from "./components/Error";
import PersistLogin from "./components/PersistLogin";
import MyEvents from "./components/MyEvents";
import CreateEvent from "./components/CreateEvent";

const App = () => {
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<PersistLogin />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/events/:id" element={<SingleEvent />} />
            <Route path="/user/:user_id" element={<UserPage />} />
            <Route path="/error" element={<Error />} />

            {/* protected routes */}
            {/* <Route element={<RequireAuth allowedRoles={[100, 200]} />}>
              <Route path="/user/:user_id/settings" />
            </Route> */}

            <Route element={<RequireAuth allowedRoles={[200]} />}>
              <Route path="/myevents" element={<MyEvents />} />
              <Route path="/create-event" element={<CreateEvent />} />
              {/* My Events route - here you can edit, delete events you made*/}
            </Route>
          </Route>
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
