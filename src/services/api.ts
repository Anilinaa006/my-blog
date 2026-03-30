// API服务

const API_BASE_URL = 'http://localhost:3001/api';

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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '登录失败');
  }

  return response.json();
}

// 注册
async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '注册失败');
  }

  return response.json();
}

// 保存令牌和用户信息
function saveToken(token: string, user: { id: number; username: string }): void {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// 获取令牌
function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

// 获取用户信息
function getUser(): { id: number; username: string } | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// 移除令牌和用户信息
function removeToken(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

// 检查是否已登录
function isLoggedIn(): boolean {
  return !!getToken();
}

export const authAPI = {
  login,
  register,
  saveToken,
  getToken,
  getUser,
  removeToken,
  isLoggedIn
};
