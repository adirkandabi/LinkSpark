import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import CancelIcon from "@mui/icons-material/Close";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, getAllPosts, updatePost, deletePost } from "../api/posts";
import NewPostSection from "./NewPostSection";

export default function Posts({ user }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getAllPosts({ author_id: user.user_id }),
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ post_id, content }) => updatePost(post_id, { content }),
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });

  const handleNewPost = (newContent) => {
    createMutation.mutate({
      author_id: user.user_id,
      content: newContent,
    });
  };

  const handleEdit = (post) => {
    setEditingId(post.post_id);
    setEditedContent(post.content);
  };

  const handleSaveEdit = (post_id) => {
    updateMutation.mutate({ post_id, content: editedContent });
    setEditingId(null);
    setEditedContent("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedContent("");
  };

  const handleDelete = (post_id) => {
    deleteMutation.mutate(post_id);
  };

  return (
    <Box>
      <NewPostSection user={user} onPost={handleNewPost} />

      {isLoading ? (
        <CircularProgress />
      ) : posts.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No posts yet.
        </Typography>
      ) : (
        [...posts]
          .sort(
            (a, b) =>
              new Date(b.updated_at || b.created_at) -
              new Date(a.updated_at || a.created_at)
          )
          .map((post) => (
            <Paper
              key={post.post_id}
              elevation={1}
              sx={{
                p: 2,
                my: 2,
                borderRadius: 2,
                backgroundColor: "#fafafa",
                position: "relative",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    src={post.author?.profile_image || ""}
                    alt={post.author?.first_name || "User"}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="subtitle2" color="text.secondary">
                    {post.author?.first_name || user.first_name} •{" "}
                    {post.updated_at
                      ? `Edited: ${new Date(post.updated_at).toLocaleString()}`
                      : new Date(post.created_at).toLocaleString()}
                  </Typography>
                </Box>

                {post.author_id === user.user_id && (
                  <Box>
                    <IconButton onClick={() => handleEdit(post)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(post.post_id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {editingId === post.post_id ? (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={() => handleSaveEdit(post.post_id)}
                      disabled={!editedContent.trim()}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {post.content}
                </Typography>
              )}
            </Paper>
          ))
      )}
    </Box>
  );
}
