import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");     
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }) 
    });
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}