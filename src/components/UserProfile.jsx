import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EditProfileModal from "./EditProfileModal";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Avatar,
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Skeleton,
  Button,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import Posts from "./Posts";
import { getProfile } from "../api/profile";

export default function UserProfile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user_id } = useParams();
  const navigate = useNavigate();
  const isPersonal = user_id === Cookies.get("user");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile", user_id],
    queryFn: async () => {
      if (!user_id) throw new Error("User ID is required");
      const res = await getProfile(user_id);

      return res.data.user;
    },
  });
  const handleProfileUpdate = (updatedData) => {
    queryClient.setQueryData(["userProfile", user_id], (prev) => ({
      ...prev,
      ...updatedData,
    }));
  };
  if (isLoading)
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Skeleton variant="circular" width={100} height={100} />
            <Box>
              <Skeleton width="60%" height={40} />
              <Skeleton width="40%" height={25} />
              <Skeleton width="70%" height={20} />
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton height={30} width="80%" />
                <Skeleton height={20} width="60%" />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    );

  if (error)
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 3, textAlign: "center" }}
        >
          <Typography variant="h5" color="error" fontWeight="bold" gutterBottom>
            User Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We couldn't find a user with the provided ID. It may have been
            deleted or never existed.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate("/")}
          >
            Go Back Home
          </Button>
        </Paper>
      </Container>
    );
  return (
    <>
      <EditProfileModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={data}
        profile={data}
        onUpdate={handleProfileUpdate}
      />

      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 3, position: "relative" }}
        >
          {isPersonal && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              size="small"
              sx={{ position: "absolute", top: 16, right: 16 }}
              onClick={() => setIsEditOpen(true)}
            >
              Edit Profile
            </Button>
          )}

          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              src={data.profile_image}
              alt={data.first_name}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {data.first_name} {data.last_name}{" "}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                @{data.username}
                {data.job_title && ` • ${data.job_title}`}
                {data.company && ` @ ${data.company}`}
              </Typography>

              {(data.location || data.bio) && (
                <Typography variant="body2" color="text.secondary">
                  {data.location}
                  {data.location && data.bio && " • "}
                  {data.bio}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">📧 Email:</Typography>
              <Typography>{data.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">📞 Phone:</Typography>
              <Typography>{data.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">🎂 Birthday:</Typography>
              <Typography>{data.birthday}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">🎓 Education:</Typography>
              <Typography>{data.education}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">💼 Job Title:</Typography>
              <Typography>{data.job_title}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">❤️ Relationship Status:</Typography>
              <Typography>{data.relationship_status}</Typography>
            </Grid>
          </Grid>
        </Paper>
        <Posts user={data} isHomePage={false} />
      </Container>
    </>
  );
}
