<template>
  <div class="blog-detail-wrapper">
    <Header />

    <div v-if="!post" class="not-found">
      <h2>Post Not Found</h2>
      <button @click="goBack" class="back-btn">Back to Blog</button>
    </div>

    <div v-else class="layout">
      <section class="main">
        <nav class="crumb" aria-label="Breadcrumb">
          <a class="crumb-link" href="/blog">Guides</a>
          <span class="crumb-sep">›</span>
          <span class="crumb-current">{{ post.title }}</span>
        </nav>

        <h1 class="page-title">{{ post.title }}</h1>

        <div class="hero-sub">
          <span class="date">{{ post.publishDate }}</span>
          <span v-if="post.tags?.length" class="dot">•</span>
          <span v-if="post.tags?.length" class="tags">{{ (post.tags || []).join(', ') }}</span>
        </div>

        <div class="content-panel">
          <p class="excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
          <article class="v-html-content" v-html="post.detailsHtml"></article>
        </div>
      </section>

      <aside class="sidebar" aria-label="Post info">
        <div class="info-card">
          <div class="info-title">{{ post.title }}</div>
          <img class="info-img" :src="post.imageUrl" :alt="post.imageAlt || post.title" />

          <div class="info-meta">
            <div class="info-row">
              <span class="info-label">Updated</span>
              <span class="info-value">{{ post.publishDate }}</span>
            </div>

            <div v-if="post.tags?.length" class="pill-row">
              <span v-for="t in post.tags" :key="t" class="pill">{{ t }}</span>
            </div>
          </div>

          <a class="back-link" href="/blog">← Back to Guides</a>
        </div>
      </aside>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { blogs } from '../data/blogs.js'
import { setPageSEO } from '../utils/seo.js'

const route = useRoute()

const post = computed(() => blogs.find((b) => b.slug === route.params.slug))

const goBack = () => {
  window.location.href = '/blog'
}

watch(
  post,
  (p) => {
    if (!p) return

    const seo = p.seo || {}
    const title = seo.title || `${p.title} - Blog`
    const description = seo.description || p.excerpt || ''
    const keywords = seo.keywords || 'blog, guide, tips'

    const baseUrl = 'https://spendmusksmoney.org'
    const canonicalUrl = `${baseUrl}/blog/${p.slug}`

    setPageSEO(
      {
        title,
        description,
        keywords,
      },
      canonicalUrl
    )
  },
  { immediate: true }
)
</script>

<style scoped>
.blog-detail-wrapper {
  width: 100%;
  background: transparent;
  min-height: 100vh;
}

.not-found {
  padding: 24px;
  text-align: center;
}

.back-btn {
  margin-top: 12px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 16px;
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.crumb {
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--text-secondary);
  font-weight: 700;
  padding: 6px 2px 0;
}

.crumb-link {
  text-decoration: none;
  color: var(--text-secondary);
}

.crumb-link:hover {
  color: var(--text);
}

.crumb-sep {
  opacity: 0.7;
}

.crumb-current {
  opacity: 0.9;
}

.page-title {
  margin: 10px 0 6px;
  font-size: 44px;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.4px;
}

.hero-sub {
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--text-secondary);
  font-weight: 700;
  padding: 0 2px 10px;
}

.dot {
  opacity: 0.7;
}

.content-panel {
  position: relative;
  background: linear-gradient(180deg, rgba(26, 31, 46, 0.82), rgba(26, 31, 46, 0.68));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 14px 44px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(12px);
}

.content-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 53, 0.22),
    rgba(120, 219, 255, 0.14),
    rgba(120, 119, 198, 0.18)
  );
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.main {
  min-width: 0;
}

.excerpt {
  margin: 0 0 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.sidebar {
  position: relative;
}

.info-card {
  position: sticky;
  top: 86px;
  background: linear-gradient(180deg, rgba(26, 31, 46, 0.82), rgba(26, 31, 46, 0.68));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 12px;
  color: var(--text);
  box-shadow: 0 14px 44px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(12px);
}

.info-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 53, 0.22),
    rgba(120, 219, 255, 0.14),
    rgba(120, 119, 198, 0.18)
  );
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.info-title {
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 10px;
  letter-spacing: -0.2px;
}

.info-img {
  width: 100%;
  height: 160px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  display: block;
}

.info-meta {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 13px;
}

.info-label {
  opacity: 0.9;
}

.info-value {
  color: var(--text);
  font-weight: 800;
}

.pill-row {
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

.back-link {
  margin-top: 14px;
  display: inline-block;
  text-decoration: none;
  color: rgba(255, 107, 53, 0.9);
  font-weight: 900;
}

.back-link:hover {
  color: rgba(255, 151, 80, 0.95);
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .info-card {
    position: relative;
    top: auto;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 30px;
  }
}
</style>
