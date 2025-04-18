import React, { useState } from "react";
import { Box, Typography, Button, Card, CircularProgress, IconButton, Slide, Paper } from "@mui/material";
import TextField from '@mui/material/TextField';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

export default function LLMChatPanel({ onStateChange, defaultOpen = false, defaultExpanded = false }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Initialize states from localStorage or use defaults
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('analyticsAssistant.isOpen');
    return saved !== null ? JSON.parse(saved) : defaultOpen;
  });
  
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('analyticsAssistant.isExpanded');
    return saved !== null ? JSON.parse(saved) : defaultExpanded;
  });

  // Save states to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('analyticsAssistant.isOpen', JSON.stringify(isOpen));
    localStorage.setItem('analyticsAssistant.isExpanded', JSON.stringify(isExpanded));
  }, [isOpen, isExpanded]);

  // Initialize with default states
  React.useEffect(() => {
    if (defaultOpen !== undefined || defaultExpanded !== undefined) {
      const savedOpen = localStorage.getItem('analyticsAssistant.isOpen');
      const savedExpanded = localStorage.getItem('analyticsAssistant.isExpanded');
      
      if (savedOpen === null && defaultOpen !== undefined) {
        setIsOpen(defaultOpen);
      }
      if (savedExpanded === null && defaultExpanded !== undefined) {
        setIsExpanded(defaultExpanded);
      }
    }
  }, [defaultOpen, defaultExpanded]);

  // Notify parent component of state changes
  React.useEffect(() => {
    if (onStateChange) {
      onStateChange(isOpen, isExpanded);
    }
  }, [isOpen, isExpanded, onStateChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/custom-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error("Error fetching insight:", err);
      setResponse("Error retrieving response.");
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (responseText) => {
    const sections = responseText.split('###').map((section, index) => {
      if (index === 0) return null;
      const [title, ...content] = section.trim().split("\n");
      const cleanTitle = title.replace(/^#+\s*/, '').trim();
      
      const body = content
        .map((line) => {
          if (line.match(/^\d+\./)) {
            return (
              <Typography key={line} variant="body1" sx={{ ml: 2, fontWeight: "normal" }}>
                {line}
              </Typography>
            );
          }
          return (
            <Typography key={line} variant="body2" sx={{ ml: 4 }}>
              {line}
            </Typography>
          );
        })
        .filter(Boolean);
  
      return (
        <Box key={cleanTitle}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
            {cleanTitle}
          </Typography>
          {body}
        </Box>
      );
    });
  
    return sections;
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Chat button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          display: isOpen ? 'none' : 'block'
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#01579B',
            '&:hover': {
              backgroundColor: '#014477'
            }
          }}
        >
          <ChatIcon />
        </Button>
      </Box>

      {/* Chat panel */}
      <Box
        sx={{
          position: 'fixed',
          ...(isExpanded ? {
            top: 0,
            bottom: 0,
            right: 0,
          } : {
            bottom: 20,
            right: 20,
          }),
          zIndex: 1000,
          visibility: isOpen ? 'visible' : 'hidden',
          transform: isOpen ? 'translateX(0)' : 'translateX(420px)',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: isExpanded ? 480 : 400,
            height: isExpanded ? '100%' : 600,
            borderRadius: isExpanded ? 0 : 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box 
            sx={{ 
              px: 3, 
              py: 2, 
              borderBottom: '1px solid', 
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0077C2' }}>
              Analytics Assistant
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={handleExpand}
                size="small"
                sx={{ mr: 1 }}
              >
                {isExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Chat area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 2,
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              backgroundColor: '#fff'
            }}
          >
            {response
              ? formatResponse(response)
              : (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Try asking something like: "What page has the highest engagement?"
                </Typography>
              )}
          </Box>

          {/* Input area */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              backgroundColor: '#fff'
            }}
          >
            <TextField
              fullWidth
              placeholder="Write a message..."
              variant="outlined"
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              multiline
              minRows={1}
              maxRows={6}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f8f9fa',
                  minHeight: '48px',
                  height: 'auto',
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    }
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#f8f9fa',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#01579B',
                      borderWidth: '1px',
                    }
                  }
                },
                '& .MuiOutlinedInput-input': {
                  padding: '12px 16px',
                  overflow: 'auto',
                  maxHeight: '150px',
                  '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.7
                  }
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 80,
                py: 1,
                px: 3,
                backgroundColor: '#01579B',
                '&:hover': {
                  backgroundColor: '#014477'
                }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Send"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

