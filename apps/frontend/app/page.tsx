import { useEffect, useState } from "react";

type Post = {
  title: string;
};

export default function Home() {
  const [data, setData] = useState<Post[]>([]);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${API}/posts`)
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>My CMS Project</h1>
      {data.map((item, i) => (
        <p key={i}>{item.title}</p>
      ))}
    </div>
  );
}