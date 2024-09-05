import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import fail from "../Assets/fail.jpg";
import none from "../Assets/win.jpg";
import win from "../Assets/winner.jpg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "center",
};

export default function ResultsModal({ openModal, result }) {
  return (
    <div>
      <Modal
        open={openModal} // Use the openModal prop directly
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            color={
              result === "Incorrect Answer. Try Again"
                ? "error"
                : result === "Solution is already recognized. Please Try Again"
                ? "warning"
                : "success"
            }
            variant="h5"
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            {result}
          </Typography>
          <img
            src={
              result === "Incorrect Answer. Try Again"
                ? fail
                : result === "Solution is already recognized. Please Try Again"
                ? none
                : win
            }
            style={{ height: "200px" }}
          />
          <Button
            color={
              result === "Incorrect Answer. Try Again"
                ? "error"
                : result === "Solution is already recognized. Please Try Again"
                ? "warning"
                : "success"
            }
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
