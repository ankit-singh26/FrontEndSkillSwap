import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AcceptButton from "../components/AcceptButton";
import ChatSidebar from "../components/ChatSidebar";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Spinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchProfileAndCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const profileRes = await fetch(`${backendURL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileRes.json();
        setUser(profileData);

        const coursesRes = await fetch(`${backendURL}/profile/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!coursesRes.ok) throw new Error("Failed to fetch courses");
        const coursesData = await coursesRes.json();
        setCourses(coursesData);

        const requestsRes = await fetch(
          `${backendURL}/api/swapRequests/incoming/${profileData._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!requestsRes.ok) throw new Error("Failed to fetch requests");
        const requestsData = await requestsRes.json();
        setRequests(requestsData);
      } catch (err) {
        console.error("Error:", err.message);
        setUser(null);
        setCourses([]);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndCourses();
  }, []);

  const prevCourse = () => {
    setCurrentIndex((prev) => (prev === 0 ? courses.length - 1 : prev - 1));
  };

  const nextCourse = () => {
    setCurrentIndex((prev) => (prev === courses.length - 1 ? 0 : prev + 1));
  };

  const deleteCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem("token");
      const courseId = courses[currentIndex]._id;

      const res = await fetch(`${backendURL}/api/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete course");
      }

      const updatedCourses = courses.filter((_, idx) => idx !== currentIndex);
      setCourses(updatedCourses);

      if (currentIndex >= updatedCourses.length && updatedCourses.length > 0) {
        setCurrentIndex(updatedCourses.length - 1);
      } else if (updatedCourses.length === 0) {
        setCurrentIndex(0);
      }
    } catch (err) {
      alert(`Error deleting course: ${err.message}`);
    }
  };

  if (loading) return <Spinner />;

  if (!user)
    return (
      <main className="flex items-center justify-center min-h-screen text-red-600 text-lg">
        Could not load profile. Please log in.
      </main>
    );

  return (
    <div className="min-h-screen p-6 space-y-10 relative">
      {/* Requests Sidebar */}
      {showSidebar && (
        <aside className="fixed top-13 right-0 h-full w-80 bg-white border-l shadow-2xl z-40 overflow-y-auto transition duration-300">
          <header className="flex justify-between items-center px-4 py-4 border-b">
            <h2 className="text-xl font-semibold">Incoming Requests</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-blue-600 text-2xl font-bold hover:text-blue-800 transition"
              aria-label="Close Requests Sidebar"
            >
              ✖
            </button>
          </header>
          <div className="p-4 space-y-4">
            {requests.length === 0 || !requests.swaps ? (
              <p className="text-gray-500">No requests yet.</p>
            ) : (
              requests.swaps.map((req, index) => (
                <section
                  key={index}
                  className="p-4 border rounded-xl shadow-sm bg-gray-50"
                >
                  <p>
                    <strong>From:</strong> {req.requesterId?.name || "Unknown"}
                  </p>
                  <p>
                    <strong>Email:</strong> {req.requesterId?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Message:</strong> {req.message}
                  </p>
                  <p>
                    <strong>Skill Offered:</strong> {req.requesterSkill}
                  </p>
                  <p>
                    <strong>Looking For:</strong> {req.desiredSkill}
                  </p>
                  <AcceptButton requestId={req._id} />
                </section>
              ))
            )}
          </div>
        </aside>
      )}

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={chatSidebarOpen}
        onClose={() => setChatSidebarOpen(false)}
        onChatSelect={(chatId) => {
          setActiveChat(chatId);
          setChatSidebarOpen(false);
        }}
      />

      {/* Profile Card */}
      <section className="bg-white p-8 rounded-2xl shadow-xl max-w-xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold text-indigo-800">👤 {user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500">
          Joined on {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setShowSidebar(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-lg transition"
            aria-label="View Incoming Requests"
          >
            📥 View Requests
          </button>
          <button
            onClick={() => setChatSidebarOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg transition"
            aria-label="Open Chats"
          >
            💬 Open Chats
          </button>
        </div>

        <Link to="/create-course">
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-xl shadow transition">
            ➕ Create Skill & Intro Video
          </button>
        </Link>
      </section>

      {/* Course Carousel */}
      <section className="bg-white p-6 rounded-2xl shadow-xl max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          🎓 Your Courses
        </h2>
        {courses.length === 0 ? (
          <p className="text-center text-gray-500">
            No courses yet. Start by creating one!
          </p>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <video
              controls
              className="w-full max-w-xl rounded-xl shadow"
              src={courses[currentIndex].videoURL}
              preload="metadata"
            />

            <h3 className="text-xl font-bold text-gray-800">
              {courses[currentIndex].title}
            </h3>
            <p className="text-gray-700">{courses[currentIndex].description}</p>
            <div className="text-left w-full max-w-xl space-y-1 text-gray-700">
              <p>
                <strong>Skills Offered:</strong> {courses[currentIndex].skills}
              </p>
              <p>
                <strong>Looking For:</strong> {courses[currentIndex].lookingFor}
              </p>
            </div>
            <button
              onClick={deleteCourse}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow"
              aria-label="Delete current course"
            >
              🗑️ Delete Course
            </button>
            <div className="flex space-x-4">
              <button
                onClick={prevCourse}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
                aria-label="Previous course"
              >
                ← Prev
              </button>
              <button
                onClick={nextCourse}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
                aria-label="Next course"
              >
                Next →
              </button>
            </div>
            <p className="text-gray-500">
              {currentIndex + 1} / {courses.length}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
