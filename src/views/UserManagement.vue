<template>
  <el-container class="user-management-container">
    <el-main class="user-management-main">
      <div class="page-header">
        <h1>用户管理</h1>
        <p>管理博客用户，包括查看用户列表和删除用户。</p>
      </div>

      <el-card class="user-table-card">
        <div class="table-header">
          <span>用户列表</span>
        </div>

        <el-table :data="users" v-loading="loading" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="头像" width="80">
            <template #default="scope">
              <el-avatar :size="40" :src="getAvatarUrl(scope.row)">
                {{ getDefaultAvatarText(scope.row.username) }}
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="role" label="角色">
            <template #default="scope">
              <el-tag :type="scope.row.role === 'author' ? 'danger' : 'success'">
                {{ scope.row.role === 'author' ? '作者' : '用户' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="注册时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button
                v-if="scope.row.role !== 'author'"
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
              <span v-else class="no-action">不可删除</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="empty-tip" v-if="!loading && users.length === 0">
          暂无用户
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { authAPI } from "../services/api";

interface User {
  id: number;
  username: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
}

const users = ref<User[]>([]);
const loading = ref(false);

const getAvatarUrl = (user: User): string | undefined => {
  if (!user.avatarUrl) return undefined;
  if (user.avatarUrl.startsWith("http")) return user.avatarUrl;
  return `http://localhost:3001${user.avatarUrl}`;
};

const getDefaultAvatarText = (username: string): string => {
  return username.slice(0, 2).toUpperCase();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await fetch("/api/auth/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authAPI.getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "获取用户列表失败");
    }

    users.value = data;
  } catch (error: any) {
    ElMessage.error(error.message || "获取用户列表失败");
    console.error("获取用户列表失败:", error);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户「${user.username}」吗？`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const response = await fetch(`/api/auth/users/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authAPI.getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "删除用户失败");
    }

    ElMessage.success("用户删除成功");
    fetchUsers();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "删除用户失败");
    }
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-management-container {
  min-height: calc(100vh - 60px);
}

.user-management-main {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  color: #1c2740;
  font-size: 2rem;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: #687892;
}

.user-table-card {
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(70, 92, 128, 0.08);
}

.table-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid #ebf1f8;
  margin-bottom: 1rem;
}

.table-header span {
  font-weight: 600;
  color: #1c2740;
}

.empty-tip {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.no-action {
  color: #ccc;
  font-size: 0.85rem;
}
</style>