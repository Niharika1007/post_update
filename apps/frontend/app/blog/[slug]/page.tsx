import { notFound } from "next/navigation";
import { Renderer } from "../../../components/Renderer";
import { TOC } from "../../../components/TOC";

export const revalidate = 900;

export async function generateMetadata({ params }: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/slug/${params.slug}`
  );

  if (res.status === 404) return {};

  const post = await res.json();

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function Page({ params }: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/slug/${params.slug}`,
    { next: { revalidate: 900 } }
  );

  if (res.status === 404) return notFound();

  const post = await res.json();

  return (
    <div>
      <h1>{post.title}</h1>

      <TOC blocks={post.content} />

      <Renderer blocks={post.content} />
    </div>
  );
}