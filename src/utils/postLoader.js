// 静态导入所有Markdown文章
const postModules = {
  "first-post": () => import("../assets/posts/first-post.md?raw"),
  "js的闭包": () => import("../assets/posts/js的闭包.md?raw"),
  "bfc": () => import("../assets/posts/bfc.md?raw"),
  "常见的css问题": () => import("../assets/posts/常见的css问题.md?raw"),
  "react-01day": () => import("../assets/posts/react-01day.md?raw"),
  "react-day2": () => import("../assets/posts/react-day2.md?raw"),
  "关于部署纯前端静态网站": () => import("../assets/posts/关于部署纯前端静态网站.md?raw"),
};

// 获取所有文章列表
export const getAllPosts = async () => {
  const postList = [];
  
  for (const [id, importFn] of Object.entries(postModules)) {
    try {
      const module = await importFn();
      const content = module.default;
      postList.push({ id, content });
    } catch (error) {
      console.error(`加载文章 ${id} 失败:`, error);
    }
  }
  
  return postList;
};

// 根据ID获取单个文章
export const getPostById = async (id) => {
  const importFn = postModules[id];
  if (!importFn) {
    throw new Error("文章不存在");
  }
  
  try {
    const module = await importFn();
    return module.default;
  } catch (error) {
    console.error(`加载文章 ${id} 失败:`, error);
    throw error;
  }
};

// 获取所有文章ID列表
export const getPostIds = () => {
  return Object.keys(postModules);
};
