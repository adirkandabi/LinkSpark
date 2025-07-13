import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Avatar,
    Tooltip,
    Chip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function GroupCard({ group, userId, onEdit, onDelete, onJoin }) {
    const navigate = useNavigate();
    const isOwner = group.owner_id === userId;
    const isMember = group.members?.includes(userId);
    const createdAt = new Date(group.created_at).toLocaleDateString();
    const membersCount = group.members?.length || 0;

    const handleClick = () => {
        navigate(`/groups/${group.group_id}`);
    };

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    const handleJoin = async (e) => {
        stopPropagation(e);
        try {
            await axios.post(`${apiUrl}/groups/${group.group_id}/join`, {
                user_id: userId,
            });
            if (onJoin) onJoin();
        } catch (err) {
            console.error("Failed to join group", err);
            alert("Join failed. Try again.");
        }
    };

    const handleLeave = async (e) => {
        stopPropagation(e);
        const confirm = window.confirm("Are you sure you want to leave this group?");
        if (!confirm) return;

        try {
            await axios.post(`${apiUrl}/groups/${group.group_id}/leave`, {
                user_id: userId,
            });
            if (onJoin) onJoin();
        } catch (err) {
            console.error("Failed to leave group", err);
            alert("Leave failed. Try again.");
        }
    };

    return (
        <Card
            sx={{ p: 2, borderRadius: 3, boxShadow: 3, cursor: "pointer" }}
            onClick={handleClick}
        >
            <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar>
                        <GroupIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6">{group.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {group.description || "No description provided."}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {isOwner && (
                            <Tooltip title="You are the owner">
                                <Chip
                                    icon={<AdminPanelSettingsIcon />}
                                    label="Owner"
                                    color="primary"
                                />
                            </Tooltip>
                        )}
                        {!isOwner && isMember && (
                            <Chip
                                label="Member"
                                color="success"
                                size="small"
                            />
                        )}
                        <Chip
                            icon={<GroupIcon />}
                            label={`Members: ${membersCount}`}
                            size="small"
                        />
                        <Chip label={`Created: ${createdAt}`} size="small" />
                    </Box>

                    <Box display="flex" gap={1}>
                        {isOwner && (
                            <>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={(e) => {
                                        stopPropagation(e);
                                        onEdit(group);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={(e) => {
                                        stopPropagation(e);
                                        onDelete(group.group_id);
                                    }}
                                >
                                    Delete
                                </Button>
                            </>
                        )}

                        {!isOwner && !isMember && (
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<PersonAddAlt1Icon />}
                                onClick={handleJoin}
                            >
                                Join
                            </Button>
                        )}

                        {!isOwner && isMember && (
                            <Button
                                variant="outlined"
                                size="small"
                                color="warning"
                                startIcon={<LogoutIcon />}
                                onClick={handleLeave}
                            >
                                Leave
                            </Button>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
