type Block = {
  type: string;
  level?: number;
  text?: string;
};

export function TOC({ blocks }: { blocks: Block[] }) {
  const headings = blocks.filter(
    (b) => b.type === "heading" && (b.level === 2 || b.level === 3)
  );

  return (
    <div>
      <h3>Table of Contents</h3>
      <ul>
        {headings.map((h, i) => (
          <li key={i}>{h.text}</li>
        ))}
      </ul>
    </div>
  );
}