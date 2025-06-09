import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const ChatSidebar = ({ isOpen, onClose, onChatSelect }) => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  // Decode user ID once
  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    try {
      currentUserId = JSON.parse(atob(token.split(".")[1]))._id;
    } catch {
      currentUserId = null;
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    const fetchChats = async () => {
      try {
        const res = await fetch(`${backendURL}/api/chats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch chats");
        const data = await res.json();
        setChats(data.chats || []);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setChats([]);
      }
    };

    fetchChats();
  }, [isOpen, token]);

  return (
    <div
      className={`fixed top-13 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ maxHeight: "100vh" }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold text-black">Your Chats</h2>
        <button
          onClick={onClose}
          className="text-blue-600 text-2xl font-bold hover:text-blue-800 transition"
          aria-label="Close chat sidebar"
        >
          ✖
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
        {chats.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No active chats</p>
        ) : (
          <ul className="space-y-3">
            {chats.map((chat) => {
              const otherUser = chat.participants.find(
                (u) => u._id !== currentUserId
              );
              return (
                <li key={chat._id}>
                  <button
                    onClick={() => {
                      navigate(`/chat/${chat._id}`);
                      onChatSelect(chat._id);
                    }}
                    className="w-full text-left p-3 rounded-md hover:bg-blue-100 transition-colors text-black font-medium"
                  >
                    💬 Chat with {otherUser?.name || "Unknown"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
