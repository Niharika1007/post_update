const API = process.env.NEXT_PUBLIC_API_URL!;

export const getPosts = async () => {
  const res = await fetch(`${API}/posts`);
  return res.json();
};

export const getPost = async (slug: string) => {
  const res = await fetch(`${API}/posts/slug/${slug}`);
  return res.json();
};