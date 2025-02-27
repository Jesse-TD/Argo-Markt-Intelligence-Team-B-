import React from "react";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Add authentication 
    // If authentication is successful:
    navigate('/dashboard');
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Area */}
      <Box
        sx={{
          flex: 1,
          background: "linear-gradient(135deg, #DBEBFB 0%, #01579B 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          ARGO Data
        </Typography>
        <Box
          sx={{
            width: "80%",
            maxWidth: 400,
            marginTop: 4,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
        </Box>
      </Box>

      {/* Right Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography variant="h5" fontWeight="bold">
            Welcome to ARGO's Marketing Intelligence Platform.
          </Typography>

          <TextField fullWidth label="Email" variant="outlined" margin="normal" />
          <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" />

          <Button
            fullWidth
            variant="contained"
            sx={{ marginTop: 2, backgroundColor: "#01579B", "&:hover": { backgroundColor: "#2575FC" } }}
            onClick={handleLogin}
          >
            LogIn

          </Button>

          <Divider sx={{ my: 3 }}></Divider>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ flex: 1 }}
            >
              Sign in with Google

            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
