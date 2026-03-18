import { marked } from "marked";

export function parseMarkdown(markdown) {
  return marked(markdown);
}

export function getPostMetadata(content) {
  // 确保content是字符串
  if (typeof content !== "string") {
    console.log("Content is not a string:", typeof content);
    return {
      title: "Untitled",
      date: new Date().toISOString(),
      content: "",
    };
  }

  console.log("Raw content preview:", content.substring(0, 200));

  // 尝试匹配front matter，使用更宽松的正则表达式
  const metaMatch = content.match(/^---[\s\S]*?---/m);
  if (!metaMatch) {
    console.log("No front matter found");
    console.log("Content preview:", content.substring(0, 100));
    return {
      title: "Untitled",
      date: new Date().toISOString(),
      content: content,
    };
  }

  const metaContent = metaMatch[0];
  console.log("Extracted front matter:", metaContent);
  const contentWithoutMeta = content.replace(metaMatch[0], "").trim();

  const metadata = {
    title: "Untitled",
    date: new Date().toISOString(),
    content: contentWithoutMeta,
  };

  // 解析front matter，使用更直接的方法
  const lines = metaContent.split(/\r?\n/);
  console.log("Front matter lines:", lines);

  lines.forEach((line, index) => {
    console.log(`Line ${index}: ${line}`);
    // 跳过空行和分隔符
    if (line.trim() === "" || line.trim() === "---") {
      return;
    }

    // 直接查找title字段
    if (line.toLowerCase().startsWith("title:")) {
      const titleValue = line.substring(line.indexOf(":") + 1).trim();
      metadata.title = titleValue;
      console.log(`Found title: ${titleValue}`);
    } else if (line.toLowerCase().startsWith("date:")) {
      const dateValue = line.substring(line.indexOf(":") + 1).trim();
      metadata.date = dateValue;
      console.log(`Found date: ${dateValue}`);
    } else if (line.toLowerCase().startsWith("categories:")) {
      const categoriesValue = line.substring(line.indexOf(":") + 1).trim();
      metadata.categories = categoriesValue;
      console.log(`Found categories: ${categoriesValue}`);
    }
  });

  console.log("Final metadata:", metadata);
  return metadata;
}
