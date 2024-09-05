import { useLocation } from "react-router-dom";
import Board from "./Board/Board";
import Header from "./Header/Header";
import { Box } from "@mui/material";

function Root() {
  const name = useLocation().state.name;
  return (
    <div>
      <Header name={name} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: "10px",
          bgcolor: "#adb4ff",
        }}
      >
        <Board name={name} />
      </Box>
    </div>
  );
}

export default Root;
