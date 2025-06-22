import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FillProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profile_image: "",
    bio: "",
    job_title: "",
    company: "",
    location: "",
    gender: "",
    relationship_status: "",
    education: "",
  });
  const userId = null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    const userId = Cookies.get("user");
    if (userId) {
      setFormData((prev) => ({ ...prev, user_id: userId }));
    } else {
      console.error("User ID not found in cookies");
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profile_image: reader.result }));
      };
      reader.readAsDataURL(file);

      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "profile_preset");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/ddm0nxsef/image/upload",
          formDataUpload
        );
        console.log(res);
        setFormData((prev) => ({
          ...prev,
          profile_image: res.data.secure_url,
        }));
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log(formData);
      await axios.post(`${import.meta.env.VITE_API_URL}/profile`, formData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate("/user-profile", { state: { userId: formData.user_id } });
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: "600px" }}>
      <h3 className="mb-3">Complete Your Profile</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-center m-5">
          <label htmlFor="profileImageInput" style={{ cursor: "pointer" }}>
            <img
              src={formData.profile_image || "/default-profile.png"}
              alt="Profile Preview"
              className="rounded-circle"
              style={{
                width: "220px",
                height: "220px",
                objectFit: "cover",
                border: "2px solid #ccc",
                padding: "5px",
              }}
            />
          </label>
          <input
            type="file"
            id="profileImageInput"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            name="bio"
            placeholder="Let us know about you"
            value={formData.bio}
            onChange={handleChange}
          ></textarea>
          <label htmlFor="bio">Let us know about you</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="job_title"
            placeholder="Job Title"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
          />
          <label htmlFor="job_title">Job Title</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            name="company"
            placeholder="Where do you work?"
            value={formData.company}
            onChange={handleChange}
          />
          <label htmlFor="company">Where do you work?</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Where are you from?"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <label htmlFor="location">Where are you from?</label>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            name="relationship_status"
            value={formData.relationship_status}
            onChange={handleChange}
          >
            <option value="">Your Status: </option>
            <option value="married">married</option>
            <option value="relationship">In a relationship</option>
            <option value="single">Single</option>
            <option value="divorceג">Divorced</option>
            <option value="complicated">Its complicated...</option>
          </select>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Your highest level of education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
          <label htmlFor="education">Your highest level of education</label>
        </div>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Profile"}
          </button>
          <button className="btn btn-secondary">Skip for now</button>
        </div>
      </form>
    </div>
  );
}
