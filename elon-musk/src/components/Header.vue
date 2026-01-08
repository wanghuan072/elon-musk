<template>
  <header class="header" role="banner">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="logo-section">
        <a href="#" class="logo" aria-label="Spend Money Game Home">
          <img src="/images/logo.webp" alt="Spend Money Game Logo" class="logo-image" />
          <span class="logo-text">Spend Elon Musk's Money</span>
        </a>
      </div>

      <!-- 桌面端导航菜单 -->
      <nav class="nav-section desktop-nav" role="navigation" aria-label="Character selection">
        <ul class="nav-menu" role="menubar">
          <li class="nav-item" role="none" v-for="character in allCharacters" :key="character.id">
            <a
              :href="character.id === 'elon-musk' ? '/' : `/${character.addressBar}`"
              class="nav-link"
              :class="{
                active:
                  (character.id === 'elon-musk' && $route.path === '/') ||
                  (character.id !== 'elon-musk' && $route.path === `/${character.addressBar}`),
              }"
              @click="switchCharacter(character.id)"
              role="menuitem"
              :aria-pressed="currentCharacterId === character.id"
              :aria-label="`Switch to ${character.name} character`"
            >
              <span class="nav-text">{{ character.title }}</span>
            </a>
          </li>
          <li class="nav-item" role="none">
            <a
              href="/games"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/games') }"
              role="menuitem"
              aria-label="Go to games page"
            >
              <span class="nav-text">Games</span>
            </a>
          </li>
          <li class="nav-item" role="none">
            <a
              href="/blog"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/blog') }"
              role="menuitem"
              aria-label="Go to blog page"
            >
              <span class="nav-text">Blog</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- 移动端汉堡菜单按钮 -->
      <div class="mobile-nav">
        <button
          class="hamburger-btn"
          @click="toggleMenu"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <span class="hamburger-line" :class="{ 'line-1': true, active: isMenuOpen }"></span>
          <span class="hamburger-line" :class="{ 'line-2': true, active: isMenuOpen }"></span>
          <span class="hamburger-line" :class="{ 'line-3': true, active: isMenuOpen }"></span>
        </button>

        <!-- 移动端下拉菜单 -->
        <div class="mobile-menu" :class="{ open: isMenuOpen }" v-if="isMenuOpen">
          <div class="menu-overlay" @click="closeMenu"></div>
          <div class="menu-content">
            <div class="menu-header">
              <h3 class="menu-title">Select a role</h3>
              <button class="menu-close" @click="closeMenu" aria-label="Close menu">
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <ul class="menu-list">
              <li class="menu-item" v-for="character in allCharacters" :key="character.id">
                <button
                  class="menu-link"
                  :class="{
                    active:
                      (character.id === 'elon-musk' && $route.path === '/') ||
                      (character.id !== 'elon-musk' && $route.path === `/${character.addressBar}`),
                  }"
                  @click="selectCharacter(character.id)"
                >
                  <div class="menu-text">
                    <span class="character-name">{{ character.name }}</span>
                  </div>
                </button>
              </li>
              <li class="menu-item">
                <a
                  href="/games"
                  class="menu-link"
                  :class="{ active: $route.path.startsWith('/games') }"
                  @click="closeMenu"
                >
                  <div class="menu-text">
                    <span class="character-name">Games</span>
                  </div>
                </a>
              </li>
              <li class="menu-item">
                <a
                  href="/blog"
                  class="menu-link"
                  :class="{ active: $route.path.startsWith('/blog') }"
                  @click="closeMenu"
                >
                  <div class="menu-text">
                    <span class="character-name">Blog</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { availableCharacters } from '../data/config.js'

// 定义组件名称
defineOptions({
  name: 'AppHeader',
})

const router = useRouter()
const gameStore = useGameStore()

// 当前人物ID
const currentCharacterId = computed(() => gameStore.currentCharacter?.id || null)

// 获取所有人物角色
const allCharacters = computed(() => {
  return Object.values(availableCharacters)
})

// 菜单状态
const isMenuOpen = ref(false)

// 切换人物
const switchCharacter = (characterId) => {
  gameStore.switchCharacter(characterId)
  // 根据人物ID跳转到相应路由
  if (characterId === 'elon-musk') {
    router.push('/')
  } else {
    const character = availableCharacters[characterId]
    if (character && character.addressBar) {
      router.push(`/${character.addressBar}`)
    }
  }
}

// 选择人物（移动端菜单）
const selectCharacter = (characterId) => {
  gameStore.switchCharacter(characterId)
  // 根据人物ID跳转到相应路由
  if (characterId === 'elon-musk') {
    router.push('/')
  } else {
    const character = availableCharacters[characterId]
    if (character && character.addressBar) {
      router.push(`/${character.addressBar}`)
    }
  }
  closeMenu()
}

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--card-border);
  transition: all 0.3s ease;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo区域 - 现代化图标+文字设计 */

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-image {
  width: 50px;
  height: auto;
}

.logo-text {
  white-space: nowrap;
  background: linear-gradient(135deg, #ffcc41 0%, #ff970f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-family: 'Georgia', 'Times New Roman', serif;
}

/* 导航样式 */
.nav-section {
  display: flex;
  align-items: center;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: var(--text);
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.nav-link.active {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: var(--text);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.nav-icon {
  font-size: 16px;
}

.nav-text {
  font-weight: 600;
}

/* 移动端导航 */
.mobile-nav {
  display: none;
}

/* 汉堡菜单按钮 */
.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: rgba(160, 174, 192, 0.1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 4px;
}

.hamburger-btn:hover {
  background: rgba(160, 174, 192, 0.2);
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 1px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-line.active {
  background: var(--accent);
}

.line-1.active {
  transform: rotate(45deg) translate(5px, 5px);
}

.line-2.active {
  opacity: 0;
}

.line-3.active {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* 移动端菜单 */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.menu-content {
  position: relative;
  width: 280px;
  max-width: 90vw;
  height: 100vh;
  background: var(--panel);
  backdrop-filter: blur(20px);
  border-left: 1px solid var(--panel-border);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.mobile-menu.open .menu-content {
  transform: translateX(0);
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(160, 174, 192, 0.2);
}

.menu-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.menu-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 6px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.menu-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--text);
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  margin: 0;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 20px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--panel-border);
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.06);
}

.menu-link.active {
  background: rgba(124, 58, 237, 0.15);
  border-left: 3px solid var(--accent);
}

.menu-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

.menu-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.character-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.character-balance {
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-container {
    padding: 0 16px;
  }

  .logo {
    padding: 8px 12px;
    gap: 8px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-main {
    font-size: 16px;
    letter-spacing: 0.5px;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 10px;
    height: 60px;
  }

  .logo {
    padding: 6px 10px;
    gap: 6px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .logo-main {
    font-size: 14px;
    letter-spacing: 0.3px;
  }

  .hamburger-btn {
    width: 36px;
    height: 36px;
  }

  .hamburger-line {
    width: 18px;
  }

  .menu-content {
    width: 260px;
  }

  .menu-header {
    padding: 16px;
  }

  .menu-title {
    font-size: 16px;
  }

  .menu-link {
    padding: 14px 16px;
  }

  .menu-icon {
    font-size: 20px;
    width: 36px;
    height: 36px;
  }

  .character-name {
    font-size: 14px;
  }

  .character-balance {
    font-size: 11px;
  }
}
</style> 
