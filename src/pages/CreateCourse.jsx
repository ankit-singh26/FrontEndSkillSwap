// src/pages/CreateCourse.jsx

import { useState } from "react";
import skillCategories from "../config/categories";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsLookingFor, setSkillsLookingFor] = useState("");
  const [teachCategory, setTeachCategory] = useState("");
  const [lookingCategory, setLookingCategory] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!videoFile) {
      alert("Please select an intro video.");
      return;
    }

    setSubmitting(true);

    try {
      // Upload video to Cloudinary
      const cloudForm = new FormData();
      cloudForm.append("file", videoFile);
      cloudForm.append("upload_preset", UPLOAD_PRESET);

      const cloudRes = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: cloudForm,
      });

      const cloudData = await cloudRes.json();

      if (!cloudData.secure_url) throw new Error("Cloudinary upload failed");

      const courseData = {
        title,
        description,
        skills: skillsOffered,
        lookingFor: skillsLookingFor,
        categoryOffered: teachCategory,
        categoryLookingFor: lookingCategory,
        videoURL: cloudData.secure_url,
      };

      console.log(courseData);

      const res = await fetch(`${backendURL}/api/courses/create-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Course created!");
        setTitle("");
        setDescription("");
        setSkillsOffered("");
        setSkillsLookingFor("");
        setTeachCategory("");
        setLookingCategory("");
        setVideoFile(null);
        setPreviewURL("");
      } else {
        alert(data.message || "Error creating course");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Description"
        />
        <input
          value={skillsOffered}
          onChange={(e) => setSkillsOffered(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Skill You Can Teach"
          required
        />
        <select
          value={teachCategory}
          onChange={(e) => setTeachCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Offered Category</option>
          {skillCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          value={skillsLookingFor}
          onChange={(e) => setSkillsLookingFor(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Skill You Want to Learn"
        />
        <select
          value={lookingCategory}
          onChange={(e) => setLookingCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Looking For Category</option>
          {skillCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          required
        />
        {previewURL && (
          <video src={previewURL} controls className="w-full mt-2" />
        )}
        <button
          disabled={submitting}
          className="w-full p-3 bg-blue-600 text-white rounded"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
