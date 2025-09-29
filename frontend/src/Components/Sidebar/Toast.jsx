import React, { useEffect } from "react";
import { Box, Typography, Fade } from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";

const Toast = ({ open, message, onClose, duration = 3000 }) => {
  // Automatically close the toast after the specified duration
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <Fade in={open} timeout={300}>
      <Box
        role="alert"
        aria-live="assertive"
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#10B981", // Green background
          color: "#FFFFFF",
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 1300, // Ensure it appears above other content
          maxWidth: { xs: "90%", sm: "400px" },
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 24, marginRight: 1, color: "#FFFFFF" }} />
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

export default Toast;