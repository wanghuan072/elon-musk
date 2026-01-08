<template>
  <div class="main">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
:root {
  --bg-1: #0a0e1a;
  --bg-2: #1a1f2e;
  --bg-3: #2d3748;
  --text: #f7fafc;
  --text-secondary: #a0aec0;
  --muted: #718096;
  --panel: rgba(45, 55, 72, 0.6);
  --panel-border: rgba(113, 128, 150, 0.3);
  --accent: #ff6b35;
  --accent-2: #f7931e;
  --accent-gradient: linear-gradient(135deg, #ff6b35, #f7931e);
  --success: #48bb78;
  --danger: #f56565;
  --warning: #ed8936;
  --card-bg: rgba(26, 31, 46, 0.8);
  --card-border: rgba(113, 128, 150, 0.2);
  --glow: rgba(255, 107, 53, 0.3);
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  background: linear-gradient(135deg, var(--bg-1), var(--bg-2));
  color: var(--text);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
}

/* 确保页面内容能够撑满整个视口高度 */
main {
  flex: 1;
  display: block;
  overflow-x: hidden;
}

/* 公共 V-HTML 内容样式 */
main .v-html-content,
.game-detail-wrapper .v-html-content,
.blog-detail-wrapper .v-html-content {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid rgba(113, 128, 150, 0.3);
  border-radius: 12px;
  background: rgba(26, 32, 44, 0.6);
  color: var(--text);
  line-height: 1.7;
}

main .v-html-content h2,
.game-detail-wrapper .v-html-content h2,
.blog-detail-wrapper .v-html-content h2 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 20px;
  margin-top: 30px;
  color: var(--accent);
  position: relative;
  padding-left: 16px;
  line-height: 1.3;
}

main .v-html-content h2::before,
.game-detail-wrapper .v-html-content h2::before,
.blog-detail-wrapper .v-html-content h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: var(--accent-gradient);
  border-radius: 2px;
}

main .v-html-content h3,
.game-detail-wrapper .v-html-content h3,
.blog-detail-wrapper .v-html-content h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  margin-top: 26px;
  color: var(--accent-2);
  position: relative;
  padding-left: 14px;
  line-height: 1.4;
}

main .v-html-content h3::before,
.game-detail-wrapper .v-html-content h3::before,
.blog-detail-wrapper .v-html-content h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: rgba(255, 107, 53, 0.7);
  border-radius: 2px;
}

main .v-html-content h4,
.game-detail-wrapper .v-html-content h4,
.blog-detail-wrapper .v-html-content h4 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 22px;
  color: var(--text);
  line-height: 1.4;
}

main .v-html-content h5,
.game-detail-wrapper .v-html-content h5,
.blog-detail-wrapper .v-html-content h5 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 18px;
  color: var(--text-secondary);
  line-height: 1.4;
}

main .v-html-content p,
.game-detail-wrapper .v-html-content p,
.blog-detail-wrapper .v-html-content p {
  margin-bottom: 16px;
  line-height: 1.8;
  color: #f7fafc;
  font-size: 16px;
}

main .v-html-content ul,
.game-detail-wrapper .v-html-content ul,
.blog-detail-wrapper .v-html-content ul {
  margin-bottom: 20px;
  padding-left: 24px;
  color: #f7fafc;
  list-style: none;
}

main .v-html-content ul li,
.game-detail-wrapper .v-html-content ul li,
.blog-detail-wrapper .v-html-content ul li {
  position: relative;
  margin: 12px 0;
  padding-left: 20px;
  line-height: 1.7;
}

main .v-html-content ul li::before,
.game-detail-wrapper .v-html-content ul li::before,
.blog-detail-wrapper .v-html-content ul li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
}

main .v-html-content ol,
.game-detail-wrapper .v-html-content ol,
.blog-detail-wrapper .v-html-content ol {
  margin-bottom: 20px;
  padding-left: 24px;
  color: var(--text);
  counter-reset: ol-counter;
}

main .v-html-content ol li,
.game-detail-wrapper .v-html-content ol li,
.blog-detail-wrapper .v-html-content ol li {
  position: relative;
  margin-bottom: 12px;
  padding-left: 32px;
  line-height: 1.7;
  counter-increment: ol-counter;
}

main .v-html-content ol li::before,
.game-detail-wrapper .v-html-content ol li::before,
.blog-detail-wrapper .v-html-content ol li::before {
  content: counter(ol-counter);
  position: absolute;
  left: 0;
  top: 2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

main .v-html-content strong,
.game-detail-wrapper .v-html-content strong,
.blog-detail-wrapper .v-html-content strong {
  font-weight: 700;
  color: var(--accent);
}

main .v-html-content em,
.game-detail-wrapper .v-html-content em,
.blog-detail-wrapper .v-html-content em {
  font-style: italic;
  color: var(--text-secondary);
}

main .v-html-content img,
.game-detail-wrapper .v-html-content img,
.blog-detail-wrapper .v-html-content img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 20px 0;
  border: 1px solid rgba(113, 128, 150, 0.25);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

main .v-html-content img:hover,
.game-detail-wrapper .v-html-content img:hover,
.blog-detail-wrapper .v-html-content img:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

main .v-html-content table,
.game-detail-wrapper .v-html-content table,
.blog-detail-wrapper .v-html-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--card-border);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

main .v-html-content th,
main .v-html-content td,
.game-detail-wrapper .v-html-content th,
.game-detail-wrapper .v-html-content td,
.blog-detail-wrapper .v-html-content th,
.blog-detail-wrapper .v-html-content td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid var(--card-border);
}

main .v-html-content th,
.game-detail-wrapper .v-html-content th,
.blog-detail-wrapper .v-html-content th {
  background: var(--accent-gradient);
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

main .v-html-content a,
.game-detail-wrapper .v-html-content a,
.blog-detail-wrapper .v-html-content a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

main .v-html-content a:hover,
.game-detail-wrapper .v-html-content a:hover,
.blog-detail-wrapper .v-html-content a:hover {
  color: var(--accent-2);
  border-bottom-color: var(--accent-2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  main .v-html-content h2,
  .game-detail-wrapper .v-html-content h2,
  .blog-detail-wrapper .v-html-content h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  main .v-html-content h3,
  .game-detail-wrapper .v-html-content h3,
  .blog-detail-wrapper .v-html-content h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  main .v-html-content h4,
  .game-detail-wrapper .v-html-content h4,
  .blog-detail-wrapper .v-html-content h4 {
    font-size: 16px;
    margin-bottom: 10px;
  }

  main .v-html-content h5,
  .game-detail-wrapper .v-html-content h5,
  .blog-detail-wrapper .v-html-content h5 {
    font-size: 14px;
    margin-bottom: 10px;
  }

  main .v-html-content p,
  .game-detail-wrapper .v-html-content p,
  .blog-detail-wrapper .v-html-content p {
    margin-bottom: 10px;
    font-size: 14px;
  }

  main .v-html-content ul,
  .game-detail-wrapper .v-html-content ul,
  .blog-detail-wrapper .v-html-content ul {
    margin-bottom: 10px;
    font-size: 14px;
  }

  main .v-html-content ol,
  .game-detail-wrapper .v-html-content ol,
  .blog-detail-wrapper .v-html-content ol {
    margin-bottom: 10px;
    font-size: 14px;
  }

  main .v-html-content strong,
  .game-detail-wrapper .v-html-content strong,
  .blog-detail-wrapper .v-html-content strong {
    font-size: 14px;
  }

  main .v-html-content em,
  .game-detail-wrapper .v-html-content em,
  .blog-detail-wrapper .v-html-content em {
    font-size: 14px;
  }

  main .v-html-content table,
  .game-detail-wrapper .v-html-content table,
  .blog-detail-wrapper .v-html-content table {
    font-size: 14px;
  }

  main .v-html-content th,
  main .v-html-content td,
  .game-detail-wrapper .v-html-content th,
  .game-detail-wrapper .v-html-content td,
  .blog-detail-wrapper .v-html-content th,
  .blog-detail-wrapper .v-html-content td {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
