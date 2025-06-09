import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const AcceptButton = ({ requestId }) => {
  const { userToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/swapRequests/${requestId}/accept`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to accept request");
      }

      const data = await res.json();
      navigate(`/chat/${data.chatId}`);
    } catch (error) {
      console.error("Accept error:", error);
      alert("Error accepting request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAccept}
      disabled={loading}
      className={`px-4 py-2 rounded font-semibold transition-colors duration-300
        ${loading 
          ? "bg-blue-300 cursor-not-allowed text-white" 
          : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
    >
      {loading ? "Accepting..." : "Accept"}
    </button>
  );
};

export default AcceptButton;
