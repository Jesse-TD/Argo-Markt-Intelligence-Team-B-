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
        <Box key={title}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
            {title}
          </Typography>
          {body}
        </Box>
      );
    });

    return sections;
  };

  return (
    <Box sx={{ my: 4, px: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, color: "#01579B" }}>
        Ask the Analytics Assistant
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Enter your question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
          multiline
          minRows={4}
          maxRows={6}
          sx={{
            mb: 2,
            minWidth: '900px',
            width: '100%',
            '& .MuiOutlinedInput-root': {
              height: 'auto',
            },
          }}
          InputProps={{
            style: {
              overflow: 'auto',
              padding: '10px',
            },
          }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </form>

      {response && (
        <Card variant="outlined" sx={{ mt: 4, p: 2, backgroundColor: "#f1f8ff" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Data Insights:
          </Typography>
          {/* Render the formatted sections */}
          {formatResponse(response)}
        </Card>
      )}
    </Box>
  );
}

