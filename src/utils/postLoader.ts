// 静态导入所有Markdown文章
const postModules: Record<string, () => Promise<{ default: string }>> = {
  "first-post": () => import("../assets/posts/其他/first-post.md?raw"),
  js的闭包: () => import("../assets/posts/JS/js的闭包.md?raw"),
  bfc: () => import("../assets/posts/CSS/bfc.md?raw"),
  常见的css问题: () => import("../assets/posts/CSS/常见的css问题.md?raw"),
  "react-01day": () => import("../assets/posts/React/react-01day.md?raw"),
  "react-day2": () => import("../assets/posts/React/react-day2.md?raw"),
  "react-day3": () => import("../assets/posts/React/react-day3.md?raw"),
  "react-day4": () => import("../assets/posts/React/react-day4.md?raw"),
  "react-day5": () => import("../assets/posts/React/react-day5.md?raw"),
  "react-day6": () => import("../assets/posts/React/react-day6.md?raw"),
  Vue2和Vue3区别: () => import("../assets/posts/Vue/Vue2和Vue3区别.md?raw"),
  Vue3中watch和watchEffect区别: () =>
    import("../assets/posts/Vue/Vue3中watch和watchEffect区别.md?raw"),
  Vue2和Vue3生命周期函数: () =>
    import("../assets/posts/Vue/Vue2和Vue3生命周期函数.md?raw"),
  "Vue3 常用指令": () => import("../assets/posts/Vue/Vue3 常用指令.md?raw"),
  HTTP协议详解: () => import("../assets/posts/网络/HTTP协议详解.md?raw"),
  HTTP和HTTPS的区别: () =>
    import("../assets/posts/网络/HTTP和HTTPS的区别.md?raw"),
  跨域问题详解: () => import("../assets/posts/网络/跨域问题详解.md?raw"),
  防抖: () => import("../assets/posts/JS/防抖.md?raw"),
  节流: () => import("../assets/posts/JS/节流.md?raw"),
  flex: () => import("../assets/posts/CSS/flex.md?raw"),
  prpmise: () => import("../assets/posts/JS/prpmise.md?raw"),
  关于部署纯前端静态网站: () =>
    import("../assets/posts/其他/关于部署纯前端静态网站.md?raw"),
  原型和原型链: () => import("../assets/posts/JS/原型和原型链.md?raw"),
  Hooks函数: () => import("../assets/posts/React/Hooks函数.md?raw"),
  Vue和React的区别: () =>
    import("../assets/posts/其他/Vue和React的区别.md?raw"),
};

interface PostModule {
  id: string;
  content: string;
}

// 获取所有文章列表
export const getAllPosts = async (): Promise<PostModule[]> => {
  const postList: PostModule[] = [];

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
export const getPostById = async (id: string): Promise<string> => {
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
export const getPostIds = (): string[] => {
  return Object.keys(postModules);
};
