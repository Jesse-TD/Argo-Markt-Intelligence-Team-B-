import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { auth, provider } from "../firebase"; 
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"; 

const slides = [
  {
    title: "Understand Data Instantly",
    subText: "No more digging through dashboards. Let ARGO's AI give you the answers fast.",
    image: "/login-image1.png"
  },
  {
    title: "Built for Marketers",
    subText: "Tailored insights, simplified KPIs, and natural-language filtering — made for your workflow.",
    image: "/login-image2.png"
  },
  {
    title: "Decisions, Not Dashboards",
    subText: "Cut through the noise. Turn metrics into action, instantly.",
    image: "/login-image3.png"
  }
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
    <Box sx={{ 
      display: "flex", 
      height: "100vh",
      backgroundColor: "white"
    }}>
      <Box
        sx={{
          flex: 1,
          background: "linear-gradient(135deg, #e8f3ff 0%, #89b9e4 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          position: 'relative',
          margin: 3,
          borderRadius: "16px",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5,
            textAlign: 'center',
            px: 2,
            pt: 0,
            pb: 4,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 480,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              mb: 0
            }}
          >
            <Box
              component="img"
              src={slides[currentSlide].image}
              alt="Login illustration"
              sx={{
                width: '110%',
                height: 460,
                objectFit: "contain",
                transition: "opacity 0.5s ease-in-out",
                opacity: isTransitioning ? 0 : 1,
                position: 'relative',
                top: slides[currentSlide].image === "/login-image2.png" ? '15px' 
                    : slides[currentSlide].image === "/login-image3.png" ? '30px'
                    : '70px'
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              color: "#000000",
              fontWeight: 600,
              opacity: isTransitioning ? 0 : 1,
              transition: "opacity 0.5s ease-in-out",
              fontSize: "2.2rem",
              mb: 0.25,
              mt: -1
            }}
          >
            {slides[currentSlide].title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#000000",
              opacity: isTransitioning ? 0 : 1,
              transition: "opacity 0.5s ease-in-out",
              lineHeight: 1.5,
              maxWidth: 480,
              fontSize: "1rem",
              mb: 2
            }}
          >
            {slides[currentSlide].subText}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
            {slides.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: currentSlide === index ? 24 : 6,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: currentSlide === index ? "#ffffff" : "rgba(255, 255, 255, 0.3)",
                  transition: "all 0.5s ease-in-out"
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 8,
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%", margin: "0 auto", px: 4 }}>
          <Box
            component="img"
            src="/Type=App.svg"
            alt="ARGO Logo"
            sx={{
              width: 90,
              height: 'auto',
              mb: 3
            }}
          />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold",
              mb: 1
            }}
          >
            Welcome to <Box component="span" sx={{ color: "#01579B" }}>ARGO's</Box><br />
            Marketing Intelligence Platform
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "text.secondary",
              mb: 2,
              fontSize: "0.75rem"
            }}
          >
            Use your ARGO email to sign in and get started.
          </Typography>

          <Typography 
            variant="subtitle2" 
            sx={{ 
              alignSelf: 'flex-start',
              mb: 0.25,
              fontWeight: 500
            }}
          >
            Email
          </Typography>
          <TextField 
            fullWidth 
            autoFocus
            placeholder="john.smith@argo.com"
            variant="outlined" 
            margin="none" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#f8f9fa',
              },
              mb: 2
            }}
          />

          <Typography 
            variant="subtitle2" 
            sx={{ 
              alignSelf: 'flex-start',
              mb: 0.25,
              fontWeight: 500
            }}
          >
            Password
          </Typography>
          <TextField 
            fullWidth 
            type="password" 
            placeholder="••••••••••"
            variant="outlined" 
            margin="none" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#f8f9fa',
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: '#01579B' }}
                />
              }
              label="Remember me"
            />
            <Button 
              sx={{ 
                color: '#01579B',
                textTransform: 'none'
              }}
            >
              Forgot Password?
            </Button>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{ 
              mt: 2, 
              mb: 3, 
              backgroundColor: "#01579B", 
              "&:hover": { backgroundColor: "#2575FC" },
              borderRadius: '12px',
              py: 1.5
            }}
            onClick={handleEmailLogin} 
          >
            Sign In
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ 
                flex: 1,
                borderRadius: '12px',
                py: 1.5,
                textTransform: 'none'
              }}
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
