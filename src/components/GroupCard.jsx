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

export default function GroupCard({ group, userId, onEdit, onDelete }) {
    const isOwner = group.owner_id === userId;
    const createdAt = new Date(group.created_at).toLocaleDateString();
    const membersCount = group.members?.length || 0;

    return (
        <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
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
                                <Chip icon={<AdminPanelSettingsIcon />} label="Owner" color="primary" />
                            </Tooltip>
                        )}
                        <Chip label={`Members: ${membersCount}`} size="small" />
                        <Chip label={`Created: ${createdAt}`} size="small" />
                    </Box>

                    {isOwner && (
                        <Box display="flex" gap={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => onEdit(group)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => onDelete(group.group_id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
