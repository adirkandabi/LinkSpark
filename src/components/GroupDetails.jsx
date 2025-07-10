import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    Avatar,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText
} from "@mui/material";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

export default function GroupDetails() {
    const { id: group_id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [authors, setAuthors] = useState({});
    const [editingPost, setEditingPost] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [membersDialogOpen, setMembersDialogOpen] = useState(false);
    const [groupMembers, setGroupMembers] = useState([]);

    const userId = Cookies.get("user");

    useEffect(() => {
        fetchGroup();
        fetchPosts();
    }, []);

    const fetchGroup = async () => {
        try {
            const res = await axios.get(`${apiUrl}/groups/${group_id}`);
            setGroup(res.data);
            fetchMemberDetails(res.data.members);
        } catch (err) {
            console.error("❌ Failed to load group", err);
        }
    };

    const fetchMemberDetails = async (memberIds) => {
        const memberData = [];
        for (const id of memberIds) {
            try {
                const res = await axios.get(`${apiUrl}/users/${id}`);
                memberData.push(res.data);
            } catch {
                memberData.push({ user_id: id, name: "Unknown" });
            }
        }
        setGroupMembers(memberData);
    };

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${apiUrl}/posts/filter/by-group?group_id=${group_id}`);
            setPosts(res.data);

            const uniqueAuthorIds = [...new Set(res.data.map((p) => p.author_id))];
            const authorData = {};
            await Promise.all(
                uniqueAuthorIds.map(async (id) => {
                    try {
                        const res = await axios.get(`${apiUrl}/users/${id}`);
                        authorData[id] = res.data.name;
                    } catch {
                        authorData[id] = "Unknown";
                    }
                })
            );
            setAuthors(authorData);
        } catch (err) {
            console.error("❌ Failed to load posts", err);
        }
    };

    const handlePost = async () => {
        if (!newPost.trim()) return;
        try {
            await axios.post(`${apiUrl}/posts`, {
                content: newPost,
                group_id,
                author_id: userId,
            });
            setNewPost("");
            fetchPosts();
        } catch (err) {
            console.error("❌ Failed to post", err);
        }
    };

    const handleDelete = async (post_id) => {
        const confirm = window.confirm("Are you sure you want to delete this post?");
        if (!confirm) return;

        try {
            await axios.delete(`${apiUrl}/posts/${post_id}`);
            fetchPosts();
        } catch (err) {
            console.error("❌ Failed to delete post", err);
        }
    };

    const handleUpdate = async (post_id) => {
        try {
            await axios.put(`${apiUrl}/posts/${post_id}`, { content: editContent });
            setEditingPost(null);
            fetchPosts();
        } catch (err) {
            console.error("❌ Failed to update post", err);
        }
    };

    if (!group) return <Typography>Loading group...</Typography>;

    return (
        <Box p={4}>
            <Button variant="outlined" onClick={() => navigate("/my-groups")}>← חזרה לקבוצות</Button>

            <Typography variant="h4" mt={2}>{group.name}</Typography>
            <Typography color="text.secondary">{group.description}</Typography>

            <Box mt={2} mb={2}>
                <Typography>👥 חברים: {group.members.length} <Button size="small" onClick={() => setMembersDialogOpen(true)}>הצג</Button></Typography>
                <Typography>📅 תאריך פתיחה: {new Date(group.created_at).toLocaleDateString()}</Typography>
                {group.image_url && (
                    <Box mt={2}>
                        <img src={group.image_url} alt="Group" style={{ maxWidth: "250px", borderRadius: 8 }} />
                    </Box>
                )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <TextField
                fullWidth
                multiline
                minRows={3}
                label="כתוב פוסט..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
            />
            <Button variant="contained" sx={{ mt: 1 }} onClick={handlePost}>פרסם</Button>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6">פוסטים</Typography>

            {posts.length === 0 && (
                <Typography color="text.secondary">אין פוסטים עדיין בקבוצה.</Typography>
            )}

            {posts.map((post) => (
                <Paper key={post.post_id} sx={{ my: 2, p: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
                        <Typography fontWeight="bold">{authors[post.author_id] || "משתמש"}</Typography>
                    </Box>
                    {editingPost?.post_id === post.post_id ? (
                        <>
                            <TextField
                                fullWidth
                                multiline
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <Box mt={1} display="flex" gap={1}>
                                <Button size="small" variant="contained" onClick={() => handleUpdate(post.post_id)}>שמור</Button>
                                <Button size="small" onClick={() => setEditingPost(null)}>ביטול</Button>
                            </Box>
                        </>
                    ) : (
                        <Typography>{post.content}</Typography>
                    )}

                    {post.author_id === userId && (
                        <Box mt={1} display="flex" gap={1}>
                            <Button size="small" onClick={() => { setEditingPost(post); setEditContent(post.content); }}>ערוך</Button>
                            <Button size="small" color="error" onClick={() => handleDelete(post.post_id)}>מחק</Button>
                        </Box>
                    )}
                </Paper>
            ))}

            {/* Dialog להצגת חברי הקבוצה */}
            <Dialog open={membersDialogOpen} onClose={() => setMembersDialogOpen(false)}>
                <DialogTitle>חברי הקבוצה</DialogTitle>
                <DialogContent>
                    <List>
                        {groupMembers.map((member) => (
                            <ListItem key={member.user_id}>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText primary={member.name || "Unknown"} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
