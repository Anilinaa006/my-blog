const API_BASE_URL = "/api";
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

type ApiErrorPayload = {
  error?: string;
  message?: string;
};

interface Comment {
  id: number;
  postId: string;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  likeCount: number;
}

interface CommentReply {
  id: number;
  commentId: number;
  userId: number;
  username: string;
  replyToUserId: number | null;
  replyToUsername: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

interface LikeResponse {
  likeCount: number;
  liked: boolean;
}

interface UserInfo {
  id: number;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
}

async function readResponseData<T>(
  response: Response,
): Promise<T | ApiErrorPayload | null> {
  const rawText = await response.text();

  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText) as T | ApiErrorPayload;
  } catch {
    return { message: rawText };
  }
}

function getErrorMessage(
  payload: ApiErrorPayload | null,
  fallback: string,
): string {
  return payload?.error || payload?.message || fallback;
}

async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = await readResponseData<AuthResponse>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "登录失败"),
    );
  }

  if (!payload) {
    throw new Error("登录接口未返回数据");
  }

  return payload as AuthResponse;
}

async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = await readResponseData<AuthResponse>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "注册失败"),
    );
  }

  if (!payload) {
    throw new Error("注册接口未返回数据");
  }

  return payload as AuthResponse;
}

function saveToken(
  token: string,
  user: { id: number; username: string },
): void {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

function getUser(): { id: number; username: string; avatarUrl?: string } | null {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

function removeToken(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
}

function isLoggedIn(): boolean {
  return !!getToken();
}

async function getUserInfo(): Promise<UserInfo> {
  const token = getToken();

  if (!token) {
    throw new Error("请先登录");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await readResponseData<UserInfo>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "获取用户信息失败"),
    );
  }

  if (!payload) {
    throw new Error("获取用户信息接口未返回数据");
  }

  return payload as UserInfo;
}

async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  const token = getToken();

  if (!token) {
    throw new Error("请先登录");
  }

  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  const payload = await readResponseData<{ message: string }>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "修改密码失败"),
    );
  }

  return (payload as { message: string }) ?? { message: "密码修改成功" };
}

async function getComments(postId: string): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/comments?postId=${postId}`);
    const payload = await readResponseData<Comment[]>(response);

    if (!response.ok) {
      throw new Error(
        getErrorMessage(payload as ApiErrorPayload | null, "获取评论失败"),
      );
    }

    return (payload as Comment[]) ?? [];
  } catch (error: any) {
    throw new Error(error.message || "获取评论失败");
  }
}

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

  const payload = await readResponseData<Comment>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "创建评论失败"),
    );
  }

  if (!payload) {
    throw new Error("评论接口未返回数据");
  }

  return payload as Comment;
}

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

  const payload = await readResponseData<Comment>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "更新评论失败"),
    );
  }

  if (!payload) {
    throw new Error("评论接口未返回数据");
  }

  return payload as Comment;
}

async function deleteComment(commentId: number): Promise<{ message: string }> {
  const token = getToken();

  if (!token) {
    throw new Error("请先登录");
  }

  const user = getUser();

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: user?.id }),
  });

  const payload = await readResponseData<{ message: string }>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "删除评论失败"),
    );
  }

  return (payload as { message: string }) ?? { message: "删除成功" };
}

async function likeComment(commentId: number): Promise<LikeResponse> {
  const token = getToken();

  if (!token) {
    throw new Error("请先登录");
  }

  const user = getUser();

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: user?.id }),
  });

  const payload = await readResponseData<LikeResponse>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "点赞失败"),
    );
  }

  if (!payload) {
    throw new Error("点赞接口未返回数据");
  }

  return payload as LikeResponse;
}

async function unlikeComment(commentId: number): Promise<LikeResponse> {
  const token = getToken();

  if (!token) {
    throw new Error("请先登录");
  }

  const user = getUser();

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: user?.id }),
  });

  const payload = await readResponseData<LikeResponse>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "取消点赞失败"),
    );
  }

  if (!payload) {
    throw new Error("取消点赞接口未返回数据");
  }

  return payload as LikeResponse;
}

async function getCommentReplies(commentId: number): Promise<CommentReply[]> {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}/replies`);
  const payload = await readResponseData<CommentReply[]>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "获取回复失败"),
    );
  }

  return (payload as CommentReply[]) ?? [];
}

async function createReply(
  commentId: number,
  content: string,
  replyToUserId?: number,
): Promise<CommentReply> {
  const token = getToken();

  if (!token) {
    throw new Error("请先登录");
  }

  const user = getUser();

  const response = await fetch(
    `${API_BASE_URL}/comments/${commentId}/replies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user?.id,
        content,
        replyToUserId: replyToUserId || null,
      }),
    },
  );

  const payload = await readResponseData<CommentReply>(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload as ApiErrorPayload | null, "回复失败"),
    );
  }

  if (!payload) {
    throw new Error("回复接口未返回数据");
  }

  return payload as CommentReply;
}

export const authAPI = {
  login,
  register,
  saveToken,
  getToken,
  getUser,
  removeToken,
  isLoggedIn,
  getUserInfo,
  changePassword,
};

export const commentAPI = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  getCommentReplies,
  createReply,
};
