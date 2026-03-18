export const revalidate = 900;

type Post = {
  id: number;
  title: string;
  slug: string;
};

let posts: any[] = [];

try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);

  if (res.ok) {
    posts = await res.json();
  }
} catch (e) {
  console.error("Fetch failed");
}

export default async function Blog() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    next: { revalidate: 900 }
  });

  const posts: Post[] = await res.json();

  return (
    <div>
      <h1>Blog</h1>

      {posts.map((p) => (
        <a key={p.id} href={`/blog/${p.slug}`}>
          <h2>{p.title}</h2>
        </a>
      ))}
    </div>
  );
}