import { Box, Typography } from "@mui/material";
import React from "react";

import logo from "../../Assets/logo.png";
import crown from "../../Assets/lb.png";
import { useNavigate } from "react-router-dom";

function Header({ name }) {
  const nav = useNavigate();
  return (
    <Box
      sx={{
        justifyContent: "space-between",
        // alignItems: "center",
        height: "100px",
        display: "flex",
        px: "20px",
        py: "10px",
      }}
      boxShadow={1}
    >
      <img
        style={{ cursor: "pointer" }}
        src={logo}
        onClick={() => nav("/game-home", { state: { name } })}
      />

      <img
        src={crown}
        style={{ height: "50px", marginTop: "25px", cursor: "pointer" }}
        onClick={() => nav("/leaderboard", { state: { name } })}
      />

      <Box
        sx={{
          padding: "10px",
          borderRadius: "5px",
          bgcolor: "#b6ddf2",
          height: "30%",
          marginTop: "25px",
        }}
      >
        <Typography variant="h6">{name}</Typography>
      </Box>
    </Box>
  );
}

export default Header;
