"use client";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    const endpoint = isRegistering ? "/api/register" : "/api/login";
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        location.reload();
      } else {
        const data = await response.json();
        setMessage(data.error || "An error occurred");
      }
    } catch {
      setMessage("Network error occurred");
    }
  };

  return (
    <div className="grid gap-4 max-w-sm mx-auto mt-20">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 rounded"
          type="email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 rounded"
          minLength={6}
          required
        />
        {message && (
          <div className="text-red-500 text-sm text-center">{message}</div>
        )}
        <button className="rounded bg-blue-600 py-2 text-white hover:bg-blue-700">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="text-blue-600 hover:underline text-sm"
      >
        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
      </button>
    </div>
  );
} 