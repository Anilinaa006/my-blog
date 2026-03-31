<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-brand">
        <span class="footer-kicker">Frontend Diary</span>
        <p class="footer-description">
          记录前端学习、项目实践与一些值得反复翻看的知识点。
        </p>
      </div>

      <div class="footer-meta">
        <p class="copyright">© 2026 FrontendDiary. All rights reserved.</p>
        <p class="powered">Built with Vue 3 and Element Plus.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 2rem;
  padding: 2.5rem 0;
  background:
    linear-gradient(180deg, rgba(248, 250, 255, 0.6), rgba(242, 246, 255, 0.95));
  border-top: 1px solid rgba(223, 231, 243, 0.9);
  transition: all 0.3s ease;
}

.dark .footer {
  background:
    linear-gradient(180deg, rgba(18, 23, 33, 0.72), rgba(15, 20, 29, 0.96));
  border-top-color: rgba(56, 67, 85, 0.95);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.footer-brand,
.footer-meta {
  max-width: 520px;
}

.footer-kicker {
  display: inline-block;
  margin-bottom: 0.75rem;
  color: #3978dc;
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
}

.footer-description {
  color: #5e6b82;
  line-height: 1.8;
}

.footer-meta {
  text-align: right;
}

.copyright {
  margin-bottom: 0.5rem;
  color: #3d4b63;
  font-weight: 600;
}

.powered {
  color: #7a879c;
  font-size: 0.92rem;
}

.dark .footer-description {
  color: #adb9cd;
}

.dark .copyright {
  color: #edf3ff;
}

.dark .powered {
  color: #92a0b6;
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 0;
  }

  .container {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-meta {
    text-align: left;
  }
}
</style>
