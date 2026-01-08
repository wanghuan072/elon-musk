import { createRouter, createWebHistory } from 'vue-router'
import { availableCharacters } from '../data/config.js'
import { setPageSEO, resetToDefaultSEO } from '../utils/seo.js'
import { insertMultipleStructuredData, generateOrganizationSchema, generateWebsiteSchema, generateBreadcrumbSchema } from '../utils/structuredData.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），则恢复到该位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到顶部
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Spend Elon Musk Money - Interactive Wealth Simulation Game',
        description: 'Experience what it\'s like to spend Elon Musk\'s fortune in this interactive simulation game. Buy luxury items, invest in companies, and see how far $400+ billion can go.',
        keywords: "spend elon musk's money, spend elon musk money, elon musk money, wealth simulation, interactive game, billionaire spending, luxury items, investment game"
      }
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/GamesView.vue'),
      meta: {
        title: 'Game Center - Interactive Games Collection',
        description: 'Explore our collection of interactive games. From classic arcade games to modern simulations, enjoy hours of entertainment.',
        keywords: 'interactive games, online games, browser games, arcade games, simulation games'
      }
    },
    {
      path: '/games/:addressBar',
      name: 'game-detail',
      component: () => import('../views/GameDetailView.vue'),
      meta: {
        title: 'Game Detail - Interactive Gaming Experience',
        description: 'Play this interactive game and experience the thrill of gaming. Enjoy hours of entertainment with our carefully curated game collection.',
        keywords: 'interactive game, online game, browser game, simulation game'
      }
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
      meta: {
        title: 'Blog - Guides & Explanations',
        description: 'Read guides, explainers, and updates for Spend Elon Musk Money.',
        keywords: "spend elon musk's money, blog, guides, tips, wealth simulator"
      }
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue'),
      meta: {
        title: 'Blog Post - Spend Elon Musk Money',
        description: 'Read this blog post on Spend Elon Musk Money.',
        keywords: "spend elon musk's money, blog post, guide"
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: {
        title: 'Contact Us - Get in Touch for Support',
        description: 'Contact us for questions about games, technical support, feedback, or any other inquiries. We\'re here to help with your gaming experience.',
        keywords: 'contact us, support, help, inquiries, gaming questions, customer service'
      }
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('../views/PrivacyPolicyView.vue'),
      meta: {
        title: 'Privacy Policy - How We Protect Your Information',
        description: 'Our privacy policy explains how we collect, use, and protect your personal information when you use our website and services.',
        keywords: 'privacy policy, data protection, personal information, privacy rights, data security'
      }
    },
    {
      path: '/terms-of-service',
      name: 'terms-of-service',
      component: () => import('../views/TermsOfServiceView.vue'),
      meta: {
        title: 'Terms of Service - Website Usage Agreement',
        description: 'Read our terms of service to understand the rules and guidelines for using our website and services.',
        keywords: 'terms of service, website terms, usage agreement, legal terms, service conditions'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About - Spend Elon Musk Money',
        description: 'About Spend Elon Musk Money',
        keywords: 'about, spend elon musk money, spend elon musk\'s money, about us'
      }
    },
    {
      path: '/copyright',
      name: 'copyright',
      component: () => import('../views/CopyrightView.vue'),
      meta: {
        title: 'Copyright Notice - Intellectual Property Rights',
        description: 'Information about copyright protection, permitted uses, and intellectual property rights for content on our website.',
        keywords: 'copyright notice, intellectual property, content rights, copyright protection, legal rights'
      }
    },
  ],
})

// 动态添加人物路由
Object.values(availableCharacters).forEach(character => {
  if (character.addressBar && character.id !== 'elon-musk') {
    router.addRoute({
      path: `/${character.addressBar}`,
      name: character.addressBar,
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: character.seo?.title || `Spend ${character.name}'s Money - Interactive Wealth Simulation Game`,
        description: character.seo?.description || `Experience what it's like to spend ${character.name}'s fortune in this interactive simulation game. Buy luxury items, invest in companies, and see how far their wealth can go.`,
        keywords: character.seo?.keywords || `${character.name.toLowerCase()}, money simulation, wealth game, billionaire spending, interactive game`
      }
    })
  }
})

// 全局路由守卫 - 处理SEO和结构化数据
router.beforeEach((to, from, next) => {
  // 生成canonical URL
  const baseUrl = 'https://spendmusksmoney.org'
  const canonicalUrl = `${baseUrl}${to.path}`

  // 设置基础SEO
  if (to.meta) {
    setPageSEO({
      title: to.meta.title,
      description: to.meta.description,
      keywords: to.meta.keywords
    }, canonicalUrl)
  } else {
    resetToDefaultSEO(canonicalUrl)
  }

  // 插入基础结构化数据
  const baseSchemas = [
    generateOrganizationSchema(),
    generateWebsiteSchema()
  ]

  // 添加面包屑导航结构化数据
  const breadcrumbs = []
  if (to.path !== '/') {
    breadcrumbs.push({ name: 'Home', url: '/' })
  }

  if (to.name === 'games') {
    breadcrumbs.push({ name: 'Games', url: '/games' })
  } else if (to.name === 'game-detail') {
    breadcrumbs.push({ name: 'Games', url: '/games' })
    breadcrumbs.push({ name: 'Game Detail', url: to.path })
  } else if (to.name === 'blog') {
    breadcrumbs.push({ name: 'Blog', url: '/blog' })
  } else if (to.name === 'blog-detail') {
    breadcrumbs.push({ name: 'Blog', url: '/blog' })
    breadcrumbs.push({ name: 'Post', url: to.path })
  } else if (to.name === 'contact') {
    breadcrumbs.push({ name: 'Contact', url: '/contact' })
  } else if (to.name === 'privacy-policy') {
    breadcrumbs.push({ name: 'Privacy Policy', url: '/privacy-policy' })
  } else if (to.name === 'terms-of-service') {
    breadcrumbs.push({ name: 'Terms of Service', url: '/terms-of-service' })
  } else if (to.name === 'copyright') {
    breadcrumbs.push({ name: 'Copyright', url: '/copyright' })
  } else if (to.name === 'about') {
    breadcrumbs.push({ name: 'About', url: '/about' })
  } else if (to.name !== 'home') {
    // 人物页面
    const character = Object.values(availableCharacters).find(c => c.addressBar === to.name)
    if (character) {
      breadcrumbs.push({ name: character.name, url: to.path })
    }
  }

  if (breadcrumbs.length > 0) {
    baseSchemas.push(generateBreadcrumbSchema(breadcrumbs))
  }

  // 插入结构化数据
  insertMultipleStructuredData(baseSchemas)

  next()
})

export default router
