import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    target: "",
    userAddress: "",
  });

  const [message, setMessage] = useState(""); // To show success/error message

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6535/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setMessage("Request registered successfully!");
      } else {
        setMessage("Error: " + response.data.error);
      }
    } catch (error) {
      setMessage("Error: " + error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h2>Register Request</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Title"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="deadline"
          value={formData.deadline}
          placeholder="Deadline (in minutes)"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="target"
          value={formData.target}
          placeholder="Target Amount"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="userAddress"
          value={formData.userAddress}
          placeholder="User Address"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
