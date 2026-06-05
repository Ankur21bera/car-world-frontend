import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Cardetail from "./Pages/Cardetail";
import Cars from "./Pages/Cars";
import Mybooking from "./Pages/Mybooking";
import Footer from "./Components/Footer";
import Layout from "./Pages/owner/Layout";
import Dashboard from "./Pages/owner/Dashboard";
import Addcar from "./Pages/owner/Addcar";
import Managecar from "./Pages/owner/Managecar";
import Managebooking from "./Pages/owner/Managebooking";
import Login from "./Components/Login";
import { Toaster } from "react-hot-toast";

import { useDispatch } from "react-redux";
import { getUserData } from "./redux/userSlice";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const dispatch = useDispatch();

  const isOwnerPath =
    useLocation().pathname.startsWith("/owner");

  useEffect(() => {
    const token =
      sessionStorage.getItem("token");

    if (token) {
      dispatch(getUserData());
    }
  }, [dispatch]);

  return (
    <>
      <Toaster />

      {showLogin && (
        <Login setShowLogin={setShowLogin} />
      )}

      {!isOwnerPath && (
        <Navbar setShowLogin={setShowLogin} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/car-details/:id"
          element={<Cardetail />}
        />

        <Route
          path="/cars"
          element={<Cars />}
        />

        <Route
          path="/my-bookings"
          element={<Mybooking />}
        />

        <Route
          path="/owner"
          element={<Layout />}
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="add-car"
            element={<Addcar />}
          />

          <Route
            path="manage-cars"
            element={<Managecar />}
          />

          <Route
            path="manage-bookings"
            element={<Managebooking />}
          />
        </Route>
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;