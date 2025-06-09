import { useState } from "react";
import { useNavigate } from "react-router-dom";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Sign up failed: " + (errorData.message || "Unknown error"));
        return;
      }

      alert("Sign up successful!");
      navigate("/login");
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md max-w-md w-full space-y-6"
        aria-label="Sign up form"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Name"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          pattern="[0-9]{10,15}"
          title="Please enter a valid phone number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Phone Number"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={6}
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 rounded font-semibold"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
