export default async function sitemap() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
  const posts = await res.json();

  return posts.map((p: any) => ({
    url: `http://localhost:3000/blog/${p.slug}`,
  }));
}