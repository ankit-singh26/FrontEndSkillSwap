import React, { useEffect, useRef, useState } from "react";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const ChatWindow = ({ chatId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${backendURL}/api/chats/${chatId}/messages`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load messages");

        const data = await res.json();
        setMessages(data.messages);
      } catch (err) {
        console.error("fetchMessages error:", err);
      }
    };

    if (chatId) fetchMessages();
  }, [chatId]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const messageObj = {
      senderId: user._id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${backendURL}/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageObj),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setMessages((prev) => [...prev, messageObj]);
      setNewMessage("");
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  };

  // Enter key sends message (Shift + Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto border border-gray-300 rounded-lg shadow-lg bg-white">
      {/* Header */}
      <div className="p-4 bg-blue-700 text-white font-semibold rounded-t-lg">
        Chat Room - {chatId}
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-10 select-none">
            No messages yet.
          </p>
        )}

        {messages.map((msg, idx) => {
          const isUser = msg.senderId === user._id;
          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-xl px-5 py-3 max-w-xs whitespace-pre-wrap shadow-sm ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900 border border-gray-300"
                }`}
              >
                {msg.text}
                <div
                  className={`text-xs mt-1 ${
                    isUser ? "text-blue-200" : "text-gray-400"
                  } text-right select-none`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-300 bg-white flex items-center gap-3 rounded-b-lg">
        <textarea
          rows={1}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
