import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import { Menu, X, ChevronRight } from "lucide-react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [groupedByCategory, setGroupedByCategory] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${backendURL}/api/courses`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Error ${response.status}: ${text}`);
        }
        const data = await response.json();
        setCourses(data);

        const skillSet = new Set();
        data.forEach((course) => {
          const skillsArray = course.skills
            ? course.skills.split(",").map((s) => s.trim())
            : [];
          skillsArray.forEach((skill) => skillSet.add(skill));
        });
        setSkills([...skillSet].sort());

        const grouped = {};
        data.forEach((course) => {
          const category = course.categoryOffered || "Uncategorized";
          if (!grouped[category]) grouped[category] = {};
          const skillsArray = course.skills
            ? course.skills.split(",").map((s) => s.trim())
            : ["No Skill"];
          skillsArray.forEach((skill) => {
            if (!grouped[category][skill]) grouped[category][skill] = [];
            grouped[category][skill].push(course);
          });
        });

        setGroupedByCategory(grouped);
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Failed to load courses: " + error.message);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Toggle button for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-3 bg-white hover:bg-gray-600 text-black fixed z-50 top-13 left-0 shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg p-4 md:w-64 overflow-y-auto fixed md:relative left-0 h-screen z-40 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
      >
        <h2 className="text-xl font-bold mb-4 border-b pb-2 pl-20">Skills</h2>
        <ul className="space-y-2 text-gray-700">
          {skills.length === 0 && <li>No skills found</li>}
          {skills.map((skill) => (
            <li
              key={skill}
              className="cursor-pointer hover:text-blue-600 transition-colors duration-200"
              onClick={() => {
                const el = document.getElementById(
                  `skill-${skill.replace(/\s+/g, "-")}`
                );
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  setSidebarOpen(false);
                }
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const el = document.getElementById(
                    `skill-${skill.replace(/\s+/g, "-")}`
                  );
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                    setSidebarOpen(false);
                  }
                }
              }}
              aria-label={`Scroll to skill ${skill}`}
            >
              {skill}
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay for sidebar on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 md:ml-64">
        {Object.keys(groupedByCategory).length === 0 && (
          <p className="text-center text-gray-500 mt-10">Loading courses...</p>
        )}
        {Object.entries(groupedByCategory).map(([category, skillsObj]) => (
          <section key={category} className="mb-10">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Category: {category}
            </h2>

            {Object.entries(skillsObj).map(([skillName, skillCourses]) => (
              <div
                key={skillName}
                id={`skill-${skillName.replace(/\s+/g, "-")}`}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold mb-4">{skillName}</h3>
                <Carousel items={skillCourses} />
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
