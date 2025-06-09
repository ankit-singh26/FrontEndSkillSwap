import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <p className="text-center text-gray-700 text-lg font-medium">
          Please log in to view the chat.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-xl font-semibold">Chat Room</h1>
      </header>

      <main className="flex-grow p-4 overflow-auto">
        <ChatWindow chatId={chatId} user={user} />
      </main>
    </div>
  );
};

export default ChatPage;
