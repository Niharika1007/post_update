export const revalidate = 900;

type Post = {
  id: number;
  title: string;
  slug: string;
};

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api`,
      { next: { revalidate: 900 } }
    );

    if (!res.ok) {
      console.error("API failed:", res.status);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function Blog() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog</h1>

      {posts.length === 0 && <p>No posts available</p>}

      {posts.map((p) => (
        <a key={p.id} href={`/blog/${p.slug}`}>
          <h2>{p.title}</h2>
        </a>
      ))}
    </div>
  );
}