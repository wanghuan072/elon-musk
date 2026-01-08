<template>
  <main class="home-view" role="main">
    <!-- 头部组件 -->
    <Header />

    <!-- 游戏头部区域 -->
    <section class="game-header" aria-labelledby="game-title" v-if="gameStore.currentCharacter">
      <div class="header-container">
        <div class="profile-section">
          <div class="profile-image-wrapper">
            <img
              :src="gameStore.currentCharacter.image"
              :alt="`${gameStore.currentCharacter.name} profile picture`"
              class="profile-image"
            />
            <div class="profile-glow"></div>
          </div>
          <div class="profile-info">
            <h1 id="game-title" class="game-title">{{ gameStore.currentCharacter.title }}</h1>
            <p class="game-subtitle">{{ gameStore.currentCharacter.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 余额显示区域 -->
    <section
      class="balance-section"
      :class="{ fixed: isScrolled }"
      aria-labelledby="balance-title"
      v-if="gameStore.currentCharacter"
    >
      <div class="balance-container">
        <div class="balance-slim">
          <div class="balance-main-info">
            <div class="balance-amount-section">
              <h2 class="balance-title">Current Balance</h2>
              <div class="balance-amount-row">
                <span class="balance-number">{{
                  gameStore.formatCurrency(gameStore.balance)
                }}</span>
              </div>
            </div>

            <div class="balance-actions-center">
              <button class="action-btn reset-btn" @click="resetGame">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
                <span>Reset</span>
              </button>
              <button class="action-btn receipt-btn" @click="toggleReceipt">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
                <span>Receipt</span>
              </button>
            </div>

            <div class="balance-stats-row">
              <div class="stat-item">
                <span class="stat-label">Spent</span>
                <span class="stat-value">{{ gameStore.spentPercentage }}%</span>
              </div>
              <div class="stat-divider">•</div>
              <div class="stat-item">
                <span class="stat-label">Items</span>
                <span class="stat-value">{{ gameStore.totalItems || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="balance-progress-section">
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: gameStore.spentPercentage + '%' }"
                ></div>
              </div>
              <div class="progress-percentage">{{ gameStore.spentPercentage }}%</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 商品列表区域 -->
    <section
      class="products-section"
      aria-labelledby="products-title"
      v-if="gameStore.currentCharacter"
    >
      <div class="section-header">
        <h2 id="products-title" class="section-title">Available Items</h2>
        <p class="section-subtitle">Choose from luxury items to philanthropic causes</p>
      </div>
      <div class="products-grid" role="list" aria-label="Available products">
        <ProductCard
          v-for="product in visibleProducts"
          :key="product.id"
          :product="product"
          role="listitem"
        />
      </div>
      <!-- 加载更多触发点 -->
      <div ref="loadMoreTrigger" class="load-more-trigger" v-if="hasMoreProducts">
        <div class="loading-spinner" v-if="isLoadingMore">
          <span class="spinner"></span>
          <span>Loading more items...</span>
        </div>
      </div>
      <!-- 已加载所有商品提示 -->
      <div class="all-loaded" v-if="!hasMoreProducts && visibleProducts.length > 0">
        <p>All {{ gameStore.currentProducts.length }} items loaded</p>
      </div>
    </section>

    <!-- 收据区域 -->
    <section
      class="receipt-section"
      v-if="gameStore.showReceipt"
      role="dialog"
      aria-labelledby="receipt-title"
      aria-modal="true"
    >
      <div class="receipt-overlay" @click="closeReceipt" aria-hidden="true"></div>
      <div class="receipt-modal">
        <ReceiptTable :show-receipt="gameStore.showReceipt" @close="closeReceipt" />
      </div>
    </section>

    <!-- 角色详细信息 -->
    <section
      class="character-details-section"
      v-if="gameStore.currentCharacter && gameStore.currentCharacter.detailsHtml"
    >
      <div class="character-details-container">
        <div class="v-html-content" v-html="gameStore.currentCharacter.detailsHtml"></div>
      </div>
    </section>

    <!-- 热门游戏区域 -->
    <HotGames @select="navigateToGame" />

    <!-- 钱花完弹窗 -->
    <MoneyExhaustedModal
      :show="gameStore.showMoneyExhaustedModal"
      :character-name="gameStore.currentCharacter?.name || 'Bill Gates'"
      :character-image="gameStore.currentCharacter?.image || '/images/bill-gates.webp'"
      :total-spent="gameStore.spentAmount"
      :total-items="gameStore.totalItemsPurchased"
      :format-currency="gameStore.formatCurrency"
      @close="handleCloseExhaustedModal"
      @restart="handleRestartFromExhausted"
      @view-receipt="handleViewReceiptFromModal"
    />

    <!-- 底部Footer -->
    <Footer />
  </main>
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import Header from '../components/Header.vue'
import ProductCard from '../components/ProductCard.vue'
import ReceiptTable from '../components/ReceiptTable.vue'
import HotGames from '../components/HotGames.vue'
import Footer from '../components/Footer.vue'
import MoneyExhaustedModal from '../components/MoneyExhaustedModal.vue'
import { useLazyElement } from '../utils/useLazyLoad.js'

import { useDeviceDetection } from '@/utils/useDeviceDetection.js'

const { isMobile } = useDeviceDetection()

const route = useRoute()
const gameStore = useGameStore()
const isScrolled = ref(false)

// 商品列表分页/懒加载
const itemsPerPage = computed(() => (isMobile.value ? 12 : 24)) // 移动端12个，桌面端24个
const visibleCount = ref(itemsPerPage.value)
const isLoadingMore = ref(false)
const loadMoreTrigger = ref(null)

// 计算可见的商品
const visibleProducts = computed(() => {
  return gameStore.currentProducts.slice(0, visibleCount.value)
})

// 是否还有更多商品
const hasMoreProducts = computed(() => {
  return visibleCount.value < gameStore.currentProducts.length
})

// 加载更多商品
const loadMore = () => {
  if (isLoadingMore.value || !hasMoreProducts.value) return

  isLoadingMore.value = true

  // 使用 requestAnimationFrame 优化加载体验
  requestAnimationFrame(() => {
    setTimeout(() => {
      visibleCount.value = Math.min(
        visibleCount.value + itemsPerPage.value,
        gameStore.currentProducts.length
      )
      isLoadingMore.value = false
    }, 100) // 小延迟让用户看到加载状态
  })
}

// 监听加载更多触发点
const { isVisible: isTriggerVisible, observe: observeTrigger } = useLazyElement('200px')

watch(isTriggerVisible, (visible) => {
  if (visible && hasMoreProducts.value && !isLoadingMore.value) {
    loadMore()
  }
})

// 监听角色变化，重置可见数量
watch(
  () => gameStore.currentCharacter,
  () => {
    visibleCount.value = itemsPerPage.value
  }
)

// 从store获取状态和方法
const { toggleReceipt, resetGame } = gameStore

// 导航到游戏详情页 - 使用完整页面刷新
const navigateToGame = (addressBar) => {
  window.location.href = `/games/${addressBar}`
}

// 关闭收据
const closeReceipt = () => {
  gameStore.showReceipt = false
}

// 处理钱花完弹窗事件
const handleCloseExhaustedModal = () => {
  gameStore.closeMoneyExhaustedModal()
}

const handleRestartFromExhausted = () => {
  gameStore.restartFromExhausted()
}

const handleViewReceiptFromModal = () => {
  gameStore.closeMoneyExhaustedModal()
  gameStore.toggleReceipt()
}

// 监听滚动事件
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  isScrolled.value = scrollTop > 100
}

// 组件挂载时根据路由设置角色
onMounted(async () => {
  // 根据当前路由设置正确的角色
  const currentPath = route.path

  if (currentPath === '/') {
    // 首页，设置为 Elon Musk
    gameStore.switchCharacter('elon-musk')
  } else {
    // 其他路径，查找对应的角色
    const character = Object.values(gameStore.availableCharacters || {}).find(
      (c) => c.addressBar && `/${c.addressBar}` === currentPath
    )
    if (character) {
      gameStore.switchCharacter(character.id)
    }
  }

  // 等待响应式更新完成
  await nextTick()

  window.addEventListener('scroll', handleScroll)

  // 等待 DOM 更新后开始观察加载更多触发点
  await nextTick()
  if (loadMoreTrigger.value) {
    observeTrigger(loadMoreTrigger.value)
  }
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: transparent;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
}

.home-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.3) 0%, transparent 50%);
}

/* 头部区域 - 重新设计为科技感风格 */
.game-header {
  padding: 60px 20px 40px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.profile-image-wrapper {
  position: relative;
  display: inline-block;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--accent);
  box-shadow: 0 0 30px var(--glow), 0 8px 32px rgba(0, 0, 0, 0.3);
  object-fit: cover;
}

.profile-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow) 0%, transparent 70%);
  opacity: 0.6;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.profile-info {
  flex: 1;
  min-width: 250px;
  text-align: left;
}

.game-title {
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 16px;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.1;
}

.game-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 300;
  letter-spacing: 1px;
  opacity: 0.9;
}

/* 余额显示区域 - 修复悬浮固定 */
.balance-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  width: 100%;
  z-index: 999;
  transition: all 0.3s ease;
}

.balance-section.fixed {
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--accent);
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.balance-section.fixed .balance-slim {
  background: rgba(26, 31, 46, 0.8);
  border: 1px solid rgba(255, 107, 53, 0.3);
}

.balance-section.fixed .balance-title {
  color: var(--text-secondary);
}

.balance-section.fixed .balance-amount {
  color: var(--accent);
  text-shadow: 0 0 15px var(--glow);
}

.balance-section.fixed .stat-label {
  color: var(--text-secondary);
}

.balance-section.fixed .stat-value {
  color: var(--text);
}

.balance-section.fixed .reset-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.balance-section.fixed .reset-btn:hover {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
}

.balance-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
}

.balance-slim {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 16px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.balance-main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
}

.balance-actions-center {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.balance-title {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.balance-amount-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.currency-symbol {
  font-size: 20px;
  color: var(--accent);
  font-weight: 700;
}

.balance-number {
  font-size: 28px;
  font-weight: 900;
  color: var(--accent);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  text-shadow: 0 0 15px var(--glow);
}

.balance-full {
  font-size: 14px;
  color: var(--text-secondary);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  opacity: 0.7;
  margin-left: 8px;
}

.balance-stats-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.stat-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}

.stat-divider {
  color: var(--text-secondary);
  opacity: 0.4;
  font-size: 14px;
}

.balance-progress-section {
  margin-bottom: 16px;
}

.progress-bar-container {
  position: relative;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-gradient);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.progress-percentage {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 11px;
  color: var(--accent);
  font-weight: 700;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 120px;
  height: 40px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;
  justify-content: center;
}

.reset-btn {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.receipt-btn {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

/* 商品列表区域 */
.products-section {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  opacity: 0.8;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  width: 100%;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #718096;
  font-size: 14px;
  font-weight: 500;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.all-loaded {
  margin-top: 40px;
  text-align: center;
  padding: 20px;
  color: #718096;
  font-size: 14px;
  font-weight: 500;
}

/* 收据区域 */
.receipt-section {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.receipt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.receipt-modal {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 900px;
}

/* 角色详细信息区域 */
.character-details-section {
  padding: 40px 24px;
  background: var(--panel);
  backdrop-filter: blur(10px);
}

.character-details-container {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--panel);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--panel-border);
}

/* 重置游戏按钮 */
.reset-section {
  padding: 40px 24px;
  text-align: center;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  color: #2d3748;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 154, 158, 0.3);
}

.reset-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(255, 154, 158, 0.4);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .game-header {
    padding: 50px 16px 30px;
  }

  .game-title {
    font-size: 42px;
  }

  .game-subtitle {
    font-size: 18px;
  }

  .profile-image {
    width: 120px;
    height: 120px;
  }

  .balance-main {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }

  .balance-stats {
    justify-content: center;
  }

  .balance-controls {
    justify-content: center;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .game-header {
    padding: 30px 15px 20px;
  }

  .game-subtitle {
    font-size: 16px;
  }

  .profile-image {
    width: 100px;
    height: 100px;
  }

  .balance-section {
    padding: 0 10px 20px;
  }

  .balance-container {
    padding: 20px 10px;
  }

  .balance-amount {
    font-size: 28px;
  }

  .balance-stats {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--card-border);
  }

  .stat-item:last-child {
    border-bottom: none;
  }

  .balance-controls {
    flex-direction: column;
    gap: 8px;
  }

  .reset-btn-compact,
  .view-receipt-btn {
    width: 100%;
    justify-content: center;
  }

  .products-section {
    padding: 40px 10px;
  }

  .section-title {
    font-size: 32px;
    letter-spacing: 1px;
  }

  .section-subtitle {
    font-size: 16px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .game-header {
    padding: 30px 10px 15px;
  }

  .game-title {
    font-size: 28px;
    letter-spacing: 0.5px;
  }

  .game-subtitle {
    font-size: 14px;
  }

  .profile-image {
    width: 80px;
    height: 80px;
  }

  .balance-amount {
    font-size: 24px;
  }

  .section-title {
    font-size: 28px;
  }

  .section-subtitle {
    font-size: 14px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

/* 删除加载动画和过渡效果 */

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-2);
}

::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-2);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .balance-main {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .balance-stats {
    gap: 15px;
    padding: 0;
  }

  .balance-controls {
    gap: 10px;
  }

  .reset-btn-compact,
  .view-receipt-btn {
    padding: 8px 12px;
    font-size: 12px;
    gap: 5px;
  }

  .reset-icon,
  .receipt-icon {
    font-size: 14px;
  }

  .reset-text,
  .receipt-text {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .stat-item {
    padding: 6px 12px;
  }

  .reset-btn-compact,
  .view-receipt-btn {
    padding: 6px 10px;
    font-size: 11px;
  }

  .reset-icon,
  .receipt-icon {
    font-size: 13px;
  }
}

/* 广告容器样式 */
.ad-container {
  max-width: 100%;
  padding: 10px 0;
  text-align: center;
}

.ad-container ins {
  display: inline-block;
  max-width: 100%;
}

.ad-container iframe {
  max-width: 100%;
  border: none;
  border-radius: 8px;
}

/* 紧凑重置按钮样式 */
.reset-btn-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
}

.view-receipt-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

.reset-btn-compact:hover {
  background: linear-gradient(135deg, #ff5252, #e53e3e);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.view-receipt-btn:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.reset-btn-compact:active,
.view-receipt-btn:active {
  transform: translateY(0);
}

.reset-btn-compact:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.reset-icon {
  font-size: 16px;
  display: inline-block;
}

.reset-text {
  font-size: 14px;
  font-weight: 600;
}
</style>
