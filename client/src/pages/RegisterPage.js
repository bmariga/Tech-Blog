import React, { useState } from "react";

export default function RegisterPage() {
  const [firstname, setFirstName] = useState("");
  const [secondname, setSecondName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function register(ev) {
    ev.preventDefault();

    // Client-side validation
    if (!username || !password || !firstname || !secondname) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        body: JSON.stringify({ username, password, firstname, secondname }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "HTTP error! Status: " + response.status);
      }

      // Reset error state on successful registration
      setError("");
    } catch (error) {
      // Handle registration error
      console.error("Error during registration:", error.message);
      setError(error.message || "Registration failed");
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="First name"
        value={firstname}
        onChange={(ev) => setFirstName(ev.target.value)}
      />
      <input
        type="text"
        placeholder="Second name"
        value={secondname}
        onChange={(ev) => setSecondName(ev.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button type="submit">Register</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
