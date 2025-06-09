import React, { useEffect, useState, useContext } from "react";
import Carousel from "../components/Carousel";
import SwapModal from "../components/SwapModal";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Browse = () => {
  const { user } = useAuth();
  const loggedInUserId = user?._id;

  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${backendURL}/api/courses`);
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filteredCourses = [...courses];

    if (categoryFilter.trim() !== "") {
      filteredCourses = filteredCourses.filter((course) => {
        if (!course.categoryOffered) return false;
        if (Array.isArray(course.categoryOffered)) {
          return course.categoryOffered.some((cat) =>
            cat.toLowerCase().includes(categoryFilter.trim().toLowerCase())
          );
        } else {
          return course.categoryOffered
            .toLowerCase()
            .includes(categoryFilter.trim().toLowerCase());
        }
      });
    }

    if (skillFilter.trim() !== "") {
      filteredCourses = filteredCourses.filter((course) =>
        course.skills?.toLowerCase().includes(skillFilter.trim().toLowerCase())
      );
    }

    if (userFilter.trim() !== "") {
      filteredCourses = filteredCourses.filter((course) =>
        course.user?.name
          ?.toLowerCase()
          .includes(userFilter.trim().toLowerCase())
      );
    }

    setFiltered(filteredCourses);
  }, [categoryFilter, skillFilter, userFilter, courses]);

  const handleSwapRequest = async (data) => {
    if (!selectedCourse || !user || !user._id) {
      alert("User not logged in or course not selected");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/api/swapRequests/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: loggedInUserId,
          receiverId: selectedCourse.user._id,
          courseId: selectedCourse._id,
          skill: data.skill,
          message: data.message,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to send swap");

      alert("Swap request sent successfully!");
    } catch (err) {
      console.error("Swap request failed:", err.message);
      alert("Failed to send swap request.");
    } finally {
      setSelectedCourse(null);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-medium text-gray-600">
        Loading courses...
      </div>
    );

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Browse Courses
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Filter by Category"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Skill"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by User"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />
      </div>

      <>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No courses found matching your filters.
          </p>
        ) : (
          <>
            <Carousel
              items={filtered}
              onSwapClick={(course) => {
                setSelectedCourse(course);
                setShowSwapModal(true);
              }}
            />
          </>
        )}

        {/* Swap Modal */}
        <SwapModal
          isOpen={showSwapModal}
          onClose={() => {
            setShowSwapModal(false);
            setSelectedCourse(null);
          }}
          onSubmit={handleSwapRequest}
        />
      </>
    </div>
  );
};

export default Browse;
