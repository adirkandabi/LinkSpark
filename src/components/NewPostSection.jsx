import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

export default function NewPostSection({ user, onPost }) {
  const [postContent, setPostContent] = useState("");

  const handlePost = () => {
    if (postContent.trim()) {
      onPost?.(postContent.trim());
      setPostContent("");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar src={user?.profile_image} alt={user?.first_name} />
        <Typography fontWeight="bold">{user?.first_name}</Typography>
      </Box>

      <TextField
        fullWidth
        multiline
        minRows={3}
        placeholder="What's on your mind?"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!postContent.trim()}
        >
          Post
        </Button>
      </Box>
    </Paper>
  );
}
