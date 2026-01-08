<template>
  <main class="blog-view" role="main">
    <Header />

    <section class="page-header" aria-labelledby="page-title">
      <div class="header-content">
        <h1 id="page-title" class="page-title">Blog</h1>
        <p class="page-subtitle">Guides, explainers, and updates</p>
      </div>
    </section>

    <section class="content" aria-label="Blog list">
      <h2 class="section-title">All Guides</h2>
      <div class="grid" role="list">
        <article v-for="post in posts" :key="post.slug" class="card" role="listitem">
          <a class="card-link" :href="`/blog/${post.slug}`" aria-label="Read post">
            <div class="cover-wrap">
              <img class="cover" :src="post.imageUrl" :alt="post.imageAlt || post.title" />
              <div class="cover-overlay" aria-hidden="true"></div>
            </div>

            <div class="card-body">
              <h3 class="title">{{ post.title }}</h3>
              <p class="excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>

              <div class="pill-row" v-if="post.tags?.length">
                <span v-for="t in post.tags" :key="t" class="pill">{{ t }}</span>
              </div>

              <div class="sub">
                <span class="date">Updated {{ post.publishDate }}</span>
                <span class="read-more">Read More →</span>
              </div>
            </div>
          </a>
        </article>
      </div>

      <div v-if="posts.length === 0" class="empty">No posts found.</div>
    </section>

    <Footer />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { blogs } from '../data/blogs.js'

const posts = computed(() =>
  blogs.slice().sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''))
)
</script>

<style scoped>
.blog-view {
  min-height: 100vh;
  background: transparent;
  padding: 0;
  position: relative;
  overflow-x: hidden;
}

.blog-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.25) 0%, transparent 55%),
    radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.22) 0%, transparent 55%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.18) 0%, transparent 55%);
  pointer-events: none;
}

.page-header {
  padding: 60px 24px 28px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  margin: 0;
  color: var(--muted);
  opacity: 0.9;
  font-weight: 500;
}

.content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

.section-title {
  margin: 0 0 14px;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.2px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.card {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(26, 31, 46, 0.78), rgba(26, 31, 46, 0.68));
  backdrop-filter: blur(12px);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease,
    background 0.25s ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 107, 53, 0.38);
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.32);
}

.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.cover-wrap {
  position: relative;
  overflow: hidden;
}

.cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: var(--panel);
  display: block;
  transform: scale(1);
  transition: transform 0.35s ease;
}

.card:hover .cover {
  transform: scale(1.03);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 35%,
      rgba(0, 0, 0, 0.2) 65%,
      rgba(0, 0, 0, 0.45) 100%
    ),
    radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.22), transparent 55%),
    radial-gradient(circle at 80% 30%, rgba(120, 219, 255, 0.18), transparent 60%);
  pointer-events: none;
}

.card-body {
  padding: 14px;
}

.title {
  margin-top: 2px;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.2px;
}

.sub {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  color: var(--text-secondary);
  font-size: 12px;
}

.pill-row {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  height: 26px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 107, 53, 0.28);
  background: rgba(255, 107, 53, 0.12);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 700;
  font-size: 12px;
}

.read-more {
  color: rgba(255, 107, 53, 0.95);
  font-weight: 800;
}

.excerpt {
  margin: 12px 0 0;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 14px;
}

.empty {
  margin-top: 18px;
  padding: 18px;
  text-align: center;
  border: 1px solid var(--panel-border);
  background: var(--panel);
  border-radius: 14px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .page-header {
    padding: 42px 14px 18px;
  }

  .page-title {
    font-size: 28px;
  }

  .content {
    padding: 0 14px 36px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
