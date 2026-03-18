type Block =
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; url: string }
  | { type: "quote"; text: string };

export function Renderer({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            if (block.level === 1) return <h1 key={i}>{block.text}</h1>;
            if (block.level === 2) return <h2 key={i}>{block.text}</h2>;
            if (block.level === 3) return <h3 key={i}>{block.text}</h3>;
            if (block.level === 4) return <h4 key={i}>{block.text}</h4>;
            if (block.level === 5) return <h5 key={i}>{block.text}</h5>;
            return <h6 key={i}>{block.text}</h6>;

          case "paragraph":
            return <p key={i}>{block.text}</p>;

          case "list":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );

          case "image":
            return <img key={i} src={block.url} alt="" />;

          case "quote":
            return <blockquote key={i}>{block.text}</blockquote>;

          default:
            return null;
        }
      })}
    </div>
  );
}