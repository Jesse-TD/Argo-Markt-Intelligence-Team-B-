import React, { useState } from "react";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithEmailAndPassword } from "../firebase"; 
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", email);
      navigate('/dashboard');
    } catch (error) {
      console.error("Email Login Error:", error.message);
      alert("Login failed: " + error.message);
    }
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
        <Typography variant="h4" fontWeight="bold">ARGO Data</Typography>
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

          <TextField 
            fullWidth 
            label="Email" 
            variant="outlined" 
            margin="normal" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField 
            fullWidth 
            label="Password" 
            type="password" 
            variant="outlined" 
            margin="normal" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ marginTop: 2, backgroundColor: "#01579B", "&:hover": { backgroundColor: "#2575FC" } }}
            onClick={handleEmailLogin} 
          >
            Log In
          </Button>

          <Divider sx={{ my: 3 }}></Divider>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ flex: 1 }}
              onClick={handleGoogleSignIn} 
            >
              Sign in with Google
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
