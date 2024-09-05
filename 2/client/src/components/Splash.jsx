import React, { useEffect } from "react";

import logo from "../Assets/logo.png";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/user");
    }, 3000);
  });

  return (
    <div
      style={{
        // backgroundColor: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={logo} style={{ width: "300px" }} />
    </div>
  );
}

export default Splash;
