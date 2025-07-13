import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
    Box,
    Grid,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import GroupCard from "./GroupCard";

const apiUrl = import.meta.env.VITE_API_URL;

export default function MyGroups() {
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [open, setOpen] = useState(false);
    const [editGroup, setEditGroup] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const userId = Cookies.get("user");

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        setFiltered(
            groups.filter((g) =>
                g.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, groups]);

    const fetchGroups = async () => {
        try {
            const res = await axios.get(`${apiUrl}/groups`);
            setGroups(res.data);
        } catch (err) {
            console.error("Failed to fetch groups", err);
        }
    };

    const handleOpen = (group = null) => {
        if (group)
            setFormData({ name: group.name, description: group.description });
        else setFormData({ name: "", description: "" });
        setEditGroup(group);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditGroup(null);
    };

    const handleSave = async () => {
        if (!formData.name) {
            alert("Group name is required");
            return;
        }

        try {
            const groupData = {
                ...formData,
                owner_id: userId,
            };

            if (editGroup) {
                await axios.put(`${apiUrl}/groups/${editGroup.group_id}`, groupData);
            } else {
                await axios.post(`${apiUrl}/groups`, groupData);
            }

            setOpen(false);
            setFormData({ name: "", description: "" });
            setEditGroup(null);
            fetchGroups();
        } catch (err) {
            console.error("Failed to save group", err);
            alert("Failed to save group. Please try again.");
        }
    };

    const handleDelete = async (groupId) => {
        const confirm = window.confirm("Are you sure you want to delete this group?");
        if (!confirm) return;

        try {
            await axios.delete(`${apiUrl}/groups/${groupId}`);
            fetchGroups();
        } catch (err) {
            console.error("Failed to delete group", err);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Groups
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={2}>
                <TextField
                    label="Search groups"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="contained" onClick={() => handleOpen()}>
                    Create Group
                </Button>
            </Box>

            <Grid container spacing={2}>
                {filtered.map((group) => (
                    <Grid item xs={12} sm={6} md={4} key={group.group_id}>
                        <GroupCard
                            group={group}
                            userId={userId}
                            onEdit={handleOpen}
                            onDelete={handleDelete}
                            onJoin={fetchGroups} // ✅ נוספה תמיכה בהצטרפות
                        />
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>
                    {editGroup ? "Edit Group" : "Create Group"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Group Name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
