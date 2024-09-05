import { Snackbar, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";

function Alerts({ open, message, severity }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const close = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpen(false);
  };

  return (
    <Snackbar onClose={close} open={isOpen} autoHideDuration={3000}>
      <Alert onClose={close} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Alerts;
