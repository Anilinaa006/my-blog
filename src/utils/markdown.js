import { marked } from "marked";

export function parseMarkdown(markdown) {
  return marked(markdown);
}

export function getPostMetadata(content) {
  const metaMatch = content.match(/^---[\s\S]*?---/);
  if (!metaMatch) {
    return {
      title: "Untitled",
      date: new Date().toISOString(),
      content: content,
    };
  }

  const metaContent = metaMatch[0];
  const contentWithoutMeta = content.replace(metaMatch[0], "").trim();

  const metadata = {
    title: "Untitled",
    date: new Date().toISOString(),
    content: contentWithoutMeta,
  };

  const lines = metaContent.split("\n");
  lines.forEach((line) => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key === "title") {
        metadata.title = value;
      } else if (key === "date") {
        metadata.date = value;
      }
    }
  });

  return metadata;
}
