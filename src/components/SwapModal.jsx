import { useState } from "react";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext"; // adjust path as per your project

const backendURL = import.meta.env.VITE_BACKEND_URL;

const SwapModal = ({ isOpen, onClose, onSubmit, recipientId }) => {
  const { user, token } = useAuth();

  const [requesterSkill, setRequesterSkill] = useState("");
  const [desiredSkill, setDesiredSkill] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!requesterSkill.trim())
      newErrors.requesterSkill = "Your skill is required";
    if (!desiredSkill.trim())
      newErrors.desiredSkill = "Desired skill is required";
    if (!message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log(user);

      const response = await fetch(
        `${backendURL}/api/swapRequests/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requesterId: user.id,
            recipientId,
            requesterSkill,
            desiredSkill,
            message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit swap request");
      }

      const result = await response.json();
      onSubmit?.(result); // optional callback
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ form: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Propose a Swap</h2>

      <input
        className="w-full p-2 border rounded mb-1"
        placeholder="Your Skill"
        value={requesterSkill}
        onChange={(e) => setRequesterSkill(e.target.value)}
      />
      {errors.requesterSkill && (
        <p className="text-red-500 text-sm mb-2">{errors.requesterSkill}</p>
      )}

      <input
        className="w-full p-2 border rounded mb-1"
        placeholder="Desired Skill"
        value={desiredSkill}
        onChange={(e) => setDesiredSkill(e.target.value)}
      />
      {errors.desiredSkill && (
        <p className="text-red-500 text-sm mb-2">{errors.desiredSkill}</p>
      )}

      <textarea
        className="w-full p-2 border rounded mb-1"
        placeholder="Swap Reason or Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {errors.message && (
        <p className="text-red-500 text-sm mb-2">{errors.message}</p>
      )}

      {errors.form && (
        <p className="text-red-500 text-sm mb-2">{errors.form}</p>
      )}

      <button
        className={`px-4 py-2 text-white rounded ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </Modal>
  );
};

export default SwapModal;
