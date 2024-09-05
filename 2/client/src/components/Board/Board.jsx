import { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import border from "../../Assets/border.png";
import "./Board.css";

import axios from "axios";

import queen from "../../Assets/crown.png";
import ResultsModal from "../ResultsModal";
import Alerts from "../Alert";

function Board({ name }) {
  const rows = 16;
  const cols = 16;
  const squares = [];

  const [data, setData] = useState({
    solution: Array(rows).fill(-1),
    playerName: name,
    timeTaken: "00:05:32",
  });

  const [start, setStart] = useState(false);

  const [seconds, setSeconds] = useState(0);

  const [error, setError] = useState(false);

  const [success, setSuccess] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [backDropOpen, setBackDropOpen] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [sev, setSev] = useState("");

  const [res, setRes] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setAlertOpen(false);
    }, 3000);
  }, [alertOpen]);

  useEffect(() => {
    if (error || success !== "") {
      setOpenModal(true);
      setBackDropOpen(false);
      if (error) {
        setRes("Incorrect Answer. Try Again");
      } else if (success === "Solution is already recognized") {
        setRes("Solution is already recognized. Please Try Again");
      } else {
        setRes("Congratulations! You found a solution");
      }
    }
  }, [error, success]);

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        setSeconds((prevTime) => prevTime + 1);
      }, 1000); // Increment every 1 second

      return () => clearInterval(interval);
    }
  }, [start]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return (
      `${String(hours).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}:` +
      `${String(secs).padStart(2, "0")}`
    );
  };

  const handleAdd = (i, j) => {
    if (start) {
      setAlertOpen(false);
      setData((prev) => ({
        ...prev,
        solution: prev.solution.map((item, index) => (index === i ? j : item)),
      }));
    } else {
      setAlertMessage("Start the game first");
      setSev("warning");
      setAlertOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (data.solution.includes(-1)) {
      setAlertMessage("Place all 16 queens");
      setSev("error");
      setAlertOpen(true);
    } else {
      setAlertOpen(false);
      setBackDropOpen(true);

      setStart(false);
      console.log({
        solution: data.solution.join(","),
        playerName: data.playerName,
        timeTaken: data.timeTaken,
      });

      try {
        const response = await axios.post(
          "http://localhost:8080/nqueens/validate",
          {
            solution: data.solution.join(","),
            playerName: data.playerName,
            timeTaken: data.timeTaken,
          }
        );

        console.log(response);
        setSuccess(response.data);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    setData((prev) => {
      return {
        ...prev,
        timeTaken: formatTime(seconds).toString(),
      };
    });
  }, [seconds]);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const isBlack = (i + j) % 2 === 0;
      squares.push(
        <Box
          key={`${i}-${j}`}
          className={`square ${
            j == data.solution[i] ? "selected" : isBlack ? "black" : "white"
          }`}
          onClick={() => handleAdd(i, j)}
          sx={{
            cursor: "pointer",
            "&:hover": {
              border: "5px solid blue",
              zIndex: 10,
              borderRadius: "5px",
            },
            bgcolor: j == data.solution[i] ? "red" : "",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {j == data.solution[i] && (
            <img src={queen} style={{ height: "40px" }} />
          )}
        </Box>
      );
    }
  }

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <ResultsModal result={res} openModal={openModal} />
      <Alerts open={alertOpen} severity={sev} message={alertMessage} />
      <Box
        className="chessboard"
        boxShadow={1}
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: "800px", // Adjust size as needed
          height: "800px", // Adjust size as needed
          padding: "20px",
          bgcolor: "darkblue",
          position: "relative",
          borderRadius: "5px",

          // backgroundImage: `url(${border})`,
          // backgroundSize: "cover",
          // backgroundPosition: "center",
        }}
      >
        {squares}
      </Box>
      <Box
        sx={{
          position: "fixed",
          right: "20px",
          top: "200px",
          width: "300px",
          height: "300px",
          borderRadius: "10px",
          bgcolor: "aliceblue",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        boxShadow={1}
      >
        <Typography variant="h4" sx={{ mb: "10px" }}>
          {formatTime(seconds)}
        </Typography>

        {!start ? (
          <Button
            variant="contained"
            color="success"
            onClick={() => setStart(true)}
          >
            <Typography>Start</Typography>
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        )}

        {start && (
          <Button
            sx={{ mt: "20px" }}
            variant="contained"
            color="error"
            onClick={() => window.location.reload()}
          >
            Quit & Restart
          </Button>
        )}
      </Box>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={backDropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default Board;
