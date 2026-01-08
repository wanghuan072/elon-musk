<template>
  <div class="game-detail-wrapper">
    <!-- 头部组件 -->
    <Header />

    <!-- 加载态 -->
    <div v-if="loading" class="loading">Loading game...</div>

    <!-- 未找到 -->
    <div v-else-if="!game" class="not-found">
      <h2>Game Not Found</h2>
      <button @click="goBack" class="back-btn">Back to Games</button>
    </div>

    <!-- 详情主体 -->
    <div v-else class="layout">
      <!-- 左列：主内容 -->
      <section class="main" :class="{ 'page-fullscreen': isPageFullscreen }">
        <div class="player">
          <!-- 预览蒙版（点击后显示 iframe） -->
          <div v-if="!showGameplay" class="preview" @click="toggleGameplay">
            <div class="preview-bg" :style="{ backgroundImage: `url(${game.imageUrl})` }">
              <div class="preview-overlay">
                <div class="icon">
                  <img :src="game.imageUrl" :alt="game.imageAlt || game.title" />
                </div>
                <button class="play">PLAY</button>
              </div>
            </div>
          </div>

          <!-- 游戏 iframe -->
          <div v-else class="iframe-wrap">
            <iframe
              ref="gameIframe"
              :src="game.iframeUrl"
              title="game"
              frameborder="0"
              allowfullscreen
              @load="onIframeLoad"
            ></iframe>
          </div>
        </div>

        <!-- 操作栏：左标题，右侧全屏/网页全屏按钮 -->
        <div class="controls">
          <h1 class="title">{{ game.title }}</h1>
          <div class="actions">
            <button
              class="btn"
              :disabled="!showGameplay"
              @click="toggleFullscreen"
              title="Fullscreen"
              aria-label="Fullscreen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
            <button
              class="btn"
              :disabled="!showGameplay"
              @click="togglePageFullscreen"
              title="Page Fullscreen"
              aria-label="Page Fullscreen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- About 内容（v-html 渲染） -->
        <article class="v-html-content" v-html="game.detailsHtml"></article>
      </section>

      <!-- 右列：评分/评论 -->
      <aside class="sidebar" v-if="!isPageFullscreen">
        <!-- 热门游戏推荐 -->
        <div class="panel">
          <HotGames
            v-if="game"
            :exclude-address-bar="game.addressBar"
            @select="navigateToGame"
            class="sidebar-hot-games"
          />
        </div>
      </aside>
    </div>

    <!-- 底部Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import HotGames from '../components/HotGames.vue'
import Footer from '../components/Footer.vue'
import { games } from '../data/games.js'
import { setGameDetailPageSEO } from '../utils/seo.js'
import { insertStructuredData, generateGameSchema } from '../utils/structuredData.js'

const route = useRoute()

const loading = ref(true)
const showGameplay = ref(false)
const isPageFullscreen = ref(false)
const gameIframe = ref(null)
const iframeLoaded = ref(false)

// 根据 addressBar 查找游戏
const game = computed(() => games.find((g) => g.addressBar === route.params.addressBar))

// iframe加载完成回调
function onIframeLoad() {
  iframeLoaded.value = true
}

function toggleGameplay() {
  showGameplay.value = !showGameplay.value
  if (!showGameplay.value && isPageFullscreen.value) {
    exitPageFullscreen()
  }
}

// 浏览器全屏（iframe 元素）
function toggleFullscreen() {
  if (!gameIframe.value) return
  if (!document.fullscreenElement) {
    gameIframe.value.requestFullscreen?.().catch(() => {})
  } else {
    document.exitFullscreen?.()
  }
}

// 网页全屏（铺满视口）
function togglePageFullscreen() {
  if (isPageFullscreen.value) {
    exitPageFullscreen()
  } else {
    // 如果游戏还没开始，先启动游戏
    if (!showGameplay.value) {
      showGameplay.value = true
      // 等待iframe开始加载后再全屏
      setTimeout(() => {
        if (gameIframe.value) {
          enterPageFullscreen()
        }
      }, 100)
    } else {
      enterPageFullscreen()
    }
  }
}

function enterPageFullscreen() {
  isPageFullscreen.value = true
  document.body.style.overflow = 'hidden'
}

function exitPageFullscreen() {
  isPageFullscreen.value = false
  document.body.style.overflow = 'auto'
}

// 导航到游戏详情页 - 使用完整页面刷新
const navigateToGame = (addressBar) => {
  window.location.href = `/games/${addressBar}`
}

// 返回游戏列表 - 使用完整页面刷新
const goBack = () => {
  window.location.href = '/games'
}

// 监听游戏变化，设置SEO和加载数据
watch(
  game,
  async (newGame) => {
    if (newGame) {
      // 设置游戏详情页SEO
      setGameDetailPageSEO(newGame)
      // 插入游戏结构化数据
      const gameSchema = generateGameSchema(newGame)
      insertStructuredData(gameSchema)
    }
  },
  { immediate: true }
)

onMounted(async () => {
  // 模拟轻量加载
  setTimeout(() => (loading.value = false), 200)
})

onUnmounted(() => {
  if (isPageFullscreen.value) exitPageFullscreen()
})
</script>

<style scoped>
/* Game-Comment 原始样式 */
.game-detail-wrapper {
  width: 100%;
  background: transparent;
  min-height: 100vh;
}

.loading,
.not-found {
  padding: 24px;
  text-align: center;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 左列 */
.main {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 12px;
}

.player {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--panel-border);
  background: rgba(255, 255, 255, 0.04);
}

.preview {
  aspect-ratio: 16 / 9;
}

.preview-bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  backdrop-filter: blur(6px);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2));
}

.icon img {
  width: 96px;
  height: 96px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid var(--panel-border);
  background: var(--panel);
}

.play {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
  border: 1px solid transparent;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
}

.iframe-wrap {
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
}

.iframe-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  object-fit: contain;
}

.controls {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 8px;
}

.controls .title {
  margin: 0;
  /* 重置H1默认margin */
  font-size: 16px;
  /* 设置合适的字体大小 */
  font-weight: 600;
  color: var(--text);
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  height: 36px;
  min-width: 36px;
  padding: 0 10px;
  border: 1px solid var(--panel-border);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  border-radius: 8px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 网页全屏 */
.main.page-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
  background: #000 !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
}

.main.page-fullscreen .player {
  width: 100% !important;
  height: 100% !important;
  background: #000 !important;
  border: none !important;
  border-radius: 0 !important;
}

.main.page-fullscreen .iframe-wrap {
  width: 100% !important;
  height: calc(100% - 60px) !important;
  background: #000 !important;
  aspect-ratio: unset !important;
}

.main.page-fullscreen .iframe-wrap iframe {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
  background: #000 !important;
}

.main.page-fullscreen .controls {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 60px !important;
  background: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  border: none !important;
  z-index: 10000 !important;
}

.main.page-fullscreen .controls .title {
  color: white !important;
}

.main.page-fullscreen .btn {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.main.page-fullscreen .v-html-content {
  display: none !important;
}

/* 右列 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 12px;
  color: var(--text);
}

.panel-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.summary-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-score {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.summary-count {
  font-size: 12px;
  color: #666;
}

.summary-stars .star,
.review-stars .star,
.stars-input .star {
  color: #d1d5db;
  /* 默认灰色 */
  transition: color 0.2s;
}

.summary-stars .star.filled,
.review-stars .star.filled,
.stars-input .star.filled {
  color: #f59e0b;
  /* 实心星（琥珀色） */
}

.stars-input .star.hover {
  color: #fbbf24;
  /* hover时浅橙色 */
}

.stars-input .star {
  cursor: pointer;
  margin-right: 4px;
}

.field {
  margin-bottom: 10px;
}

.label {
  display: block;
  font-size: 12px;
  color: #333;
  margin-bottom: 6px;
}

.req {
  color: #ef4444;
}

.input,
.textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  background: #f9fafb;
  color: #333;
  box-sizing: border-box;
}

.hint {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.btn.wide {
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  background: #e5e7eb;
  color: #333;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-text {
  text-align: center;
  color: #666;
  padding: 10px;
  font-size: 14px;
}

.no-reviews,
.no-ratings {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
}

.reviews {
  display: grid;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.review-item {
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
  margin-top: 10px;
}

.review-head {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.review-name {
  color: #333;
  font-weight: 600;
}

.review-date {
  color: #666;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
  font-size: 12px;
}

.review-rating-label {
  color: #666;
}

.review-stars {
  display: flex;
  gap: 2px;
}

.review-text {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.muted {
  color: #666;
  /* 次要文字 */
}

.small {
  font-size: 12px;
}

/* 评分分布样式 */
.rating-distribution {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
}

.rating-label {
  width: 30px;
  color: #666;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #f59e0b;
  transition: width 0.3s ease;
}

.rating-count {
  width: 20px;
  text-align: right;
  color: #666;
}

/* 评分选择提示 */
.rating-selected {
  margin-top: 6px;
  font-size: 12px;
  color: #059669;
  font-weight: 500;
}

.back-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
}

/* Sidebar中的HotGames样式 */
.sidebar-hot-games {
  margin-top: 0;
  /* 移除默认的上边距 */
  padding: 0;
}

.sidebar-hot-games :deep(.hot-games-container) {
  padding: 0;
  /* 移除默认padding */
}

.sidebar-hot-games :deep(.hot-games-header) {
  margin-bottom: 12px;
  /* 减少标题下方间距 */
}

.sidebar-hot-games :deep(.hot-games-title) {
  font-size: 20px;
  /* 增大标题字体 */
  font-weight: bold;
  /* 增加字体粗细 */
  margin: 0 0 6px 0;
  color: #333;
}

.sidebar-hot-games :deep(.hot-games-subtitle) {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.sidebar-hot-games :deep(.hot-games-grid) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* 一行显示两个 */
  gap: 10px;
  /* 减少间距以适应sidebar */
  margin-top: 10px;
}

.sidebar-hot-games :deep(.hot-game-item) {
  border-radius: 6px;
  /* 稍微减少圆角 */
}

.sidebar-hot-games :deep(.hot-game-title) {
  font-size: 12px;
  /* 减少字体大小 */
  padding: 8px;
  /* 减少内边距 */
  line-height: 1.3;
}

/* 自适应 */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
    padding: 12px;
  }

  /* 移动端时HotGames移回底部 */
  .sidebar .panel:has(.sidebar-hot-games) {
    order: 999;
    /* 确保在移动端时显示在最后 */
  }

  .preview {
    aspect-ratio: 1 / 2;
  }

  .iframe-wrap {
    aspect-ratio: 1 / 2;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout {
    padding: 10px;
  }
  .main {
    padding: 10px;
  }

  .sidebar-hot-games :deep(.hot-games-grid) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 一行显示两个 */
    gap: 10px;
    /* 减少间距以适应sidebar */
    margin-top: 10px;
  }
}
</style>
