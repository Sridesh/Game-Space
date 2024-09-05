import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

function User() {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    if (name !== "") {
      navigate("/game-home", { state: { name } });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundSize: "cover", // Ensures the image covers the entire Box
        // backgroundPosition: "center", // Centers the image within the Box
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/thumbnails/021/983/840/small_2x/ai-generated-black-and-golden-chess-king-business-leader-concept-photo.jpg')",
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: "300px",
            height: "300px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography sx={{ color: "white", fontSize: "1.4rem", mb: "20px" }}>
            Enter You User Name
          </Typography>
          <TextField
            value={name}
            variant="standard"
            onChange={(e) => setName(e.target.value)}
            sx={{
              "& .MuiInputBase-input": {
                color: "white", // Text color
              },
              "& .MuiFormLabel-root": {
                color: "white", // Label color
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", // Border color
                },
                "&:hover fieldset": {
                  borderColor: "white", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white", // Border color when focused
                },
              },
            }}
          />

          <Button
            color="white"
            sx={{ color: "white", mt: "50px" }}
            onClick={handleClick}
          >
            Continue
            <ArrowForwardIcon sx={{ ml: "10px" }} />
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default User;
