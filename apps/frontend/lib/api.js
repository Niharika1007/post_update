const API = process.env.NEXT_PUBLIC_API_URL;

export const getPosts = () => fetch(`${API}/posts`).then(res => res.json());

export const login = (data) =>
  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });