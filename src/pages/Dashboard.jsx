import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [groupedByCategory, setGroupedByCategory] = useState({});

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

        // Extract unique skills
        const skillSet = new Set();
        data.forEach((course) => {
          const skillsArray = course.skills
            ? course.skills.split(",").map((s) => s.trim())
            : [];
          skillsArray.forEach((skill) => skillSet.add(skill));
        });
        setSkills([...skillSet].sort());

        // Group courses by category and skill
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
    <div className="flex h-screen">
      {/* Left sidebar with skills */}
      <aside className="w-64 bg-white shadow-lg overflow-y-auto p-4 sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Available Skills</h2>
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
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const el = document.getElementById(
                    `skill-${skill.replace(/\s+/g, "-")}`
                  );
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              aria-label={`Scroll to skill ${skill}`}
            >
              {skill}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {Object.keys(groupedByCategory).length === 0 && (
          <p className="text-center text-gray-500 mt-10">Loading courses...</p>
        )}
        {Object.entries(groupedByCategory).map(([category, skillsObj]) => (
          <section key={category} className="mb-10">
            <h2 className="text-2xl font-extrabold mb-6 border-b pb-2">
              Category: {category}
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
