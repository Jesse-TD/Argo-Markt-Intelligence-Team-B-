import React, { useState } from "react";
import { Box, Typography, Button, Card, CircularProgress } from "@mui/material";
import TextField from '@mui/material/TextField';

export default function LLMChatPanel() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (index === 0) return null; // Skip the first part before the first header
      const [title, ...content] = section.trim().split("\n");
  
      const cleanTitle = title.replace(/^#+\s*/, '').trim(); // Removes leading # symbols
      
  
      // Extract numbered list items (e.g., 1., 2., 3.)
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
            {cleanTitle}  {/* Use the clean title here */}
          </Typography>
          {body}
        </Box>
      );
    });
  
    return sections;
  };
  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ px: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0077C2' }}>
          Ask the Analytics Assistant
        </Typography>
      </Box>
  
      {/* Scrollable chat area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
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
  
      {/* Sticky input bar */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 2,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your question..."
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            minWidth: 80,
            py: 1,
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Send"}
        </Button>
      </Box>
    </Box>
  );
  
}

