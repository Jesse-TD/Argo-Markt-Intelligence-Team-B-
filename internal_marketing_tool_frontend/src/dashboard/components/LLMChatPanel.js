import React, { useState } from "react";
import { Box, Typography, TextField, Button, Card, CircularProgress } from "@mui/material";

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

  return (
    <Box sx={{ my: 4, px: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, color: "#01579B" }}>
        Ask the Analytics Assistant
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Enter your question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </form>

      {response && (
        <Card variant="outlined" sx={{ mt: 4, p: 2, backgroundColor: "#f1f8ff" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>GPT Response:</Typography>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>{response}</Typography>
        </Card>
      )}
    </Box>
  );
}
