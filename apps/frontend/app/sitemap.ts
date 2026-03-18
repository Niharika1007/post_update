export default async function sitemap() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);

    // ✅ CHECK BEFORE PARSE
    if (!res.ok) {
      console.error("API failed:", res.status);
      return [];
    }

    const text = await res.text();

    // ✅ SAFETY CHECK
    if (!text.startsWith("[")) {
      console.error("Not JSON response");
      return [];
    }

    const posts = JSON.parse(text);

    return posts.map((p: any) => ({
      url: `https://post-update-app.vercel.app/blog/${p.slug}`,
    }));

  } catch (err) {
    console.error("Sitemap error:", err);
    return [];
  }
}