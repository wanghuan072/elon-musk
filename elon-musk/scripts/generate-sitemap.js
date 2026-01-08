import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const seoConfig = {
    fullDomain: 'https://spendmusksmoney.org',
}

const baseRoutes = [
    { path: '/', name: 'home', priority: 1.0, changefreq: 'weekly' },
    { path: '/games', name: 'games', priority: 0.9, changefreq: 'weekly' },
    { path: '/blog', name: 'blog', priority: 0.9, changefreq: 'weekly' },
    { path: '/contact', name: 'contact', priority: 0.6, changefreq: 'monthly' },
    { path: '/privacy-policy', name: 'privacy-policy', priority: 0.3, changefreq: 'yearly' },
    { path: '/terms-of-service', name: 'terms-of-service', priority: 0.3, changefreq: 'yearly' },
    { path: '/about', name: 'about', priority: 0.6, changefreq: 'monthly' },
    { path: '/copyright', name: 'copyright', priority: 0.3, changefreq: 'yearly' },
]

async function loadGamesData() {
    try {
        const dataPath = path.join(__dirname, '../src/data/games.js')
        if (!fs.existsSync(dataPath)) return []
        const module = await import('../src/data/games.js')
        return module.games || []
    } catch (error) {
        console.warn('Warning: Failed to load games data:', error.message)
        return []
    }
}

async function loadBlogsData() {
    try {
        const dataPath = path.join(__dirname, '../src/data/blogs.js')
        if (!fs.existsSync(dataPath)) return []
        const module = await import('../src/data/blogs.js')
        return module.blogs || []
    } catch (error) {
        console.warn('Warning: Failed to load blogs data:', error.message)
        return []
    }
}

async function loadCharactersData() {
    try {
        const dataPath = path.join(__dirname, '../src/data/config.js')
        if (!fs.existsSync(dataPath)) return []
        const module = await import('../src/data/config.js')
        const charactersMap = module.availableCharacters || {}
        return Object.values(charactersMap)
    } catch (error) {
        console.warn('Warning: Failed to load characters data:', error.message)
        return []
    }
}

function generateUrlXml(urlPath, lastmod, priority, changefreq) {
    const roundedPriority = Math.round(priority * 10) / 10
    return `  <url>\n    <loc>${seoConfig.fullDomain}${urlPath}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${roundedPriority}</priority>\n  </url>`
}

async function generateSitemap() {
    const lastmod = new Date().toISOString().split('T')[0]

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    baseRoutes.forEach((route) => {
        sitemapXml += `\n${generateUrlXml(route.path, lastmod, route.priority, route.changefreq)}`
    })

    const games = await loadGamesData()
    games
        .filter((g) => g && g.addressBar)
        .forEach((g) => {
            const slug = String(g.addressBar).replace(/^\//, '')
            const gamePath = `/games/${slug}`
            sitemapXml += `\n${generateUrlXml(gamePath, g.publishDate || lastmod, 0.8, 'monthly')}`
        })

    const blogs = await loadBlogsData()
    blogs
        .filter((b) => b && b.slug)
        .forEach((b) => {
            const slug = String(b.slug).replace(/^\//, '')
            const blogPath = `/blog/${slug}`
            sitemapXml += `\n${generateUrlXml(blogPath, b.publishDate || lastmod, 0.7, 'monthly')}`
        })

    const characters = await loadCharactersData()
    characters
        .filter((c) => c && c.addressBar && c.id !== 'elon-musk')
        .forEach((c) => {
            const slug = String(c.addressBar).replace(/^\//, '')
            const characterPath = `/${slug}`
            // 这些是站点的核心落地页（Spend Bill Gates Money / Spend Jeff Bezos Money 等）
            sitemapXml += `\n${generateUrlXml(characterPath, lastmod, 0.95, 'weekly')}`
        })

    sitemapXml += `\n</urlset>`
    return sitemapXml
}

async function main() {
    try {
        console.log('📦 Loading data...')
        console.log('🗺️  Generating sitemap...')

        const sitemapContent = await generateSitemap()

        const publicPath = path.join(__dirname, '../public/sitemap.xml')
        const distPath = path.join(__dirname, '../dist/sitemap.xml')

        const publicDir = path.dirname(publicPath)
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true })
        }

        fs.writeFileSync(publicPath, sitemapContent, 'utf8')
        console.log('✅ Generated sitemap.xml in public folder')

        if (fs.existsSync(path.join(__dirname, '../dist'))) {
            fs.writeFileSync(distPath, sitemapContent, 'utf8')
            console.log('✅ Generated sitemap.xml in dist folder')
        }

        const urlCount = (sitemapContent.match(/<url>/g) || []).length
        console.log(`✅ Total URLs in sitemap: ${urlCount}`)

        const validation =
            sitemapContent.includes('<?xml') &&
            sitemapContent.includes('<urlset') &&
            sitemapContent.includes('</urlset>')

        if (validation) {
            console.log('\n✅ Sitemap validation passed')
        } else {
            console.warn('\n⚠️  Sitemap validation failed')
        }
    } catch (error) {
        console.error('❌ Error generating sitemap:', error)
        process.exit(1)
    }
}

main()
