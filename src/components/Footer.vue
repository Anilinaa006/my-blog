<template>
  <footer class="footer">
    <div class="container">
      <p class="copyright">© 2024 My Blog. All rights reserved.</p>
      <p class="powered">Powered by Vue 3 & Element Plus</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 2rem 0;
  text-align: center;
  transition: all 0.3s ease;
}

.dark .footer {
  background-color: #1f2329;
  border-top: 1px solid #303030;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.copyright {
  color: #666;
  margin-bottom: 0.5rem;
}

.powered {
  color: #999;
  font-size: 0.9rem;
}

.dark .copyright,
.dark .powered {
  color: #909399;
}
</style>
