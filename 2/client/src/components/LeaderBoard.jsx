import axios from "axios";
import React, { useEffect, useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import Header from "./Header/Header";
import { useLocation } from "react-router-dom";

function LeaderBoard() {
  const name = useLocation().state.name;
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/nqueens/recognized-solutions"
        );
        console.log(response);
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, []);

  return (
    <div>
      <Header name={name} />
      <Box sx={{ display: "flex", justifyContent: "center", p: "10px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "50vw",
            bgcolor: "#ffde85",
            borderRadius: "5px",
            p: "20px",
          }}
          boxShadow={3}
        >
          <Typography
            variant="h5"
            sx={{ color: "orangered", textAlign: "center", mb: "20px" }}
          >
            Leader Board
          </Typography>
          <Stack direction="column" spacing={3} sx={{ px: "20px" }}>
            {data.map((item, index) => {
              return (
                <Box key={index}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{
                        color: "#403926",
                        fontWeight: 500,
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.playerName}
                    </Typography>
                    <Typography sx={{ color: "#612d0b" }}>
                      {item.timeTaken}
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </div>
  );
}

export default LeaderBoard;
