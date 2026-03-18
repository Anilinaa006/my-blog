<template>
  <el-container class="about-container">
    <el-main>
      <div class="about">
        <h2 class="page-title">关于我</h2>
        <el-card class="about-card" shadow="hover">
          <template #header>
            <div class="about-header">
              <el-avatar
                :size="80"
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar&image_size=square"
              />
              <h2 class="about-title">个人介绍</h2>
            </div>
          </template>
          <div class="about-content">
            <el-descriptions border :column="1">
              <el-descriptions-item label="姓名">
                <p>涂乾安</p>
              </el-descriptions-item>
              <el-descriptions-item label="个人介绍">
                <p>我是东华理工大学软件工程专业的一名大三学生</p>
                <p>我喜欢探索新的技术，并且对前端开发有浓厚的兴趣。</p>
              </el-descriptions-item>
              <el-descriptions-item label="博客介绍">
                <p>欢迎来到我的个人博客！</p>
                <p>我是一名前端开发者，热爱技术，喜欢分享。</p>
                <p>
                  这个博客是使用ai辅助完成的,使用 Vue 3 和 Markdown
                  搭建的，记录我的学习心得和技术分享。
                </p>
                <p>目前这个博客正在不断完善中，欢迎访问和反馈。</p>
                <p>如果有任何问题或建议，欢迎联系我。</p>
                <p>
                  邮箱：<a href="mailto:2840668784@qq.com">2840668784@qq.com</a>
                </p>
              </el-descriptions-item>
            </el-descriptions>
            <div class="about-footer">
              <el-button type="primary" round>联系我</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
// 关于页组件
</script>

<style scoped>
.about-container {
  min-height: calc(100vh - 60px);
}

.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
}

.about-card {
  transition: box-shadow 0.3s ease;
}

.about-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.about-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.about-title {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
  transition: color 0.3s ease;
}

.about-content {
  line-height: 1.8;
  color: #333;
  transition: color 0.3s ease;
}

.about-content p {
  margin-bottom: 1rem;
}

.about-footer {
  margin-top: 2rem;
  text-align: center;
}

/* 暗黑模式 */
.dark .page-title {
  color: #e0e0e0;
}

.dark .about-title {
  color: #e0e0e0;
}

.dark .about-content {
  color: #e0e0e0;
}

.dark .about-content p {
  color: #e0e0e0;
}
</style>
