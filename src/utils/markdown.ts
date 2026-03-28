import { marked } from "marked";

interface PostMetadata {
  title: string;
  date: string;
  categories: string;
  content: string;
}

/**
 * 解析Markdown内容，提取元数据和正文
 * @param markdown Markdown字符串
 * @returns 解析后的元数据和正文
 */
export const parseMarkdown = async (markdown: string): Promise<string> => {
  return await marked(markdown);
};

/**
 * 从Markdown内容中提取元数据
 * @param content Markdown字符串
 * @returns 提取的元数据
 */
export const getPostMetadata = (content: string): PostMetadata => {
  // 提取前置元数据
  const metadataMatch = content.match(/---[\s\S]*?---/);
  let metadata: PostMetadata = {
    title: "Untitled",
    date: new Date().toISOString(),
    categories: "其他",
    content: content,
  };

  if (metadataMatch) {
    const metadataString = metadataMatch[0];
    const metadataContent = content.replace(metadataMatch[0], "").trim();

    // 提取标题
    const titleMatch = metadataString.match(/title:\s*(.+)/);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // 提取日期
    const dateMatch = metadataString.match(/date:\s*(.+)/);
    if (dateMatch) {
      metadata.date = dateMatch[1].trim();
    }

    // 提取分类
    const categoriesMatch = metadataString.match(/categories:\s*(.+)/);
    if (categoriesMatch) {
      metadata.categories = categoriesMatch[1].trim();
    }

    metadata.content = metadataContent;
  }

  return metadata;
};
