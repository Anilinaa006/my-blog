// API服务

const API_BASE_URL = "http://localhost:3001/api";

interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
}

// 登录
async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "登录失败");
  }

  return response.json();
}

// 注册
async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "注册失败");
  }

  return response.json();
}

// 保存令牌和用户信息
function saveToken(
  token: string,
  user: { id: number; username: string },
): void {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// 获取令牌
function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

// 获取用户信息
function getUser(): { id: number; username: string } | null {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// 移除令牌和用户信息
function removeToken(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
}

// 检查是否已登录
function isLoggedIn(): boolean {
  return !!getToken();
}

// 评论相关API
interface Comment {
  id: number;
  post_id: string;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
  updated_at: string | null;
}

// 获取文章评论
async function getComments(postId: string): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/comments?postId=${postId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "获取评论失败");
  }

  return response.json();
}

// 创建评论
async function createComment(
  postId: string,
  content: string,
): Promise<Comment> {
  const token = getToken();

  if (!token) {
    throw new Error("请先登录");
  }

  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, content }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "创建评论失败");
  }

  return response.json();
}

// 更新评论
async function updateComment(
  commentId: number,
  content: string,
): Promise<Comment> {
  const token = getToken();

  if (!token) {
    throw new Error("请先登录");
  }

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "更新评论失败");
  }

  return response.json();
}

// 删除评论
async function deleteComment(commentId: number): Promise<{ message: string }> {
  const token = getToken();

  if (!token) {
    throw new Error("请先登录");
  }

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "删除评论失败");
  }

  return response.json();
}

export const authAPI = {
  login,
  register,
  saveToken,
  getToken,
  getUser,
  removeToken,
  isLoggedIn,
};

export const commentAPI = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
