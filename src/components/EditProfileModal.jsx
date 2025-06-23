import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import axios from "axios";
import { updateProfile } from "../api/profile";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function EditProfileModal({
  open,
  onClose,
  user,
  profile,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    profile_image: profile.profile_image || "",
    bio: profile.bio || "",
    job_title: profile.job_title || "",
    company: profile.company || "",
    location: profile.location || "",
    relationship_status: profile.relationship_status || "",
    education: profile.education || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "profile_preset");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/ddm0nxsef/image/upload",
          formDataUpload
        );
        setFormData((prev) => ({
          ...prev,
          profile_image: res.data.secure_url,
        }));
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { ...formData, user_id: user.user_id };
      const res = await updateProfile(payload);
      if (res.data.success) {
        onUpdate(res.data.profile);
        onClose();
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Edit Profile</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} textAlign="center">
            <label
              htmlFor="editProfileImageInput"
              style={{ cursor: "pointer" }}
            >
              <Avatar
                src={formData.profile_image || "/default-profile.png"}
                alt="Profile Preview"
                sx={{ width: 100, height: 100, margin: "auto" }}
              />
            </label>
            <input
              type="file"
              id="editProfileImageInput"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              minRows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Job Title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth style={{ minWidth: "10rem" }}>
              <InputLabel id="relationship-status-label">
                Relationship Status
              </InputLabel>
              <Select
                labelId="relationship-status-label"
                name="relationship_status"
                value={formData.relationship_status}
                onChange={handleChange}
                label="Relationship Status"
              >
                <MenuItem value="">Select status</MenuItem>
                <MenuItem value="married">Married</MenuItem>
                <MenuItem value="relationship">In a relationship</MenuItem>
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="divorced">Divorced</MenuItem>
                <MenuItem value="complicated">It's complicated</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
