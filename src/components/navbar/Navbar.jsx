import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import "./Navbar.scss";
import Aos from "aos";
import "aos/dist/aos.css";
import { makeRequest } from "../../axios";
import { DarkModeContext } from "../../context/darkModeContext";
const Navbar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({
      duration: 1500,
      once: true,
    });
  });
  const handleClick = async () => {
    try {
      await makeRequest.post("/api/auth/logout");
      localStorage.removeItem("user");

      navigate("/login")
    } catch (err) {
      console.log(err);
    }
  };
  
  const { curentUser } = useContext(AuthContext);
  const {toggle,dark } = useContext(DarkModeContext);
  return (
    <div className="navbar" data-aos="fade-down">
      <div className="left">
        <img
          src="../../../public/logo1.png"
          alt=""
          onClick={() => navigate("/")}
        />
        <li onClick={() => navigate("/")}>Accueil</li>
        <li onClick={() => navigate("/conseil")}>Conseil</li>
        <li onClick={() => navigate("/suivi")}>Suivi</li>
      </div>
      <div className="right">
        <button onClick={handleClick}>Log out</button>
        <p>{curentUser.username}</p>
        {dark ? (
          <ModeNightIcon onClick={() => toggle()} />
        ) : (
          <WbSunnyIcon onClick={() => toggle()} />
        )}
      </div>
    </div>
  );
};
export default Navbar;
