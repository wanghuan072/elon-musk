const BANNER_KEY = '385f4ce5ac081ca112b4243a2df1dac7'
const BANNER_INVOKE_URL = `https://www.highperformanceformat.com/${BANNER_KEY}/invoke.js`
const NATIVE_INVOKE_URL =
  'https://pl30178224.effectivecpmnetwork.com/0a998aed9549b428589f6b73e669343d/invoke.js'
const NATIVE_CONTAINER_ID = 'container-0a998aed9549b428589f6b73e669343d'
const POPUNDER_URL =
  'https://pl30178223.effectivecpmnetwork.com/81/84/76/81847652f01613b08da06d86629a2489.js'

const MOBILE_BREAKPOINT = 768

let popunderLoaded = false

export function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
}

export function getBannerSize() {
  return isMobileViewport()
    ? { width: 300, height: 250 }
    : { width: 728, height: 90 }
}

export function loadPopunder() {
  if (popunderLoaded) return
  popunderLoaded = true

  const script = document.createElement('script')
  script.src = POPUNDER_URL
  document.body.appendChild(script)
}

function createAdIframe(container, width, height) {
  const iframe = document.createElement('iframe')
  iframe.title = 'Advertisement'
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('scrolling', 'no')
  iframe.style.border = '0'
  iframe.style.overflow = 'hidden'
  iframe.style.display = 'block'
  iframe.style.maxWidth = '100%'

  if (width === '100%') {
    iframe.style.width = '100%'
    iframe.style.height = `${height}px`
    iframe.style.minHeight = `${height}px`
  } else {
    iframe.width = String(width)
    iframe.height = String(height)
    iframe.style.width = `${width}px`
    iframe.style.height = `${height}px`
  }

  container.appendChild(iframe)
  return iframe
}

function writeIframeHtml(iframe, html) {
  const doc = iframe.contentWindow?.document
  if (!doc) return

  doc.open()
  doc.write(html)
  doc.close()
}

/** Native Banner - 使用联盟提供的原始代码结构 */
export function loadNativeBanner(container) {
  if (!container) return

  container.innerHTML = ''

  const iframe = createAdIframe(container, '100%', 280)
  writeIframeHtml(
    iframe,
    `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;text-align:center;">
<script async="async" data-cfasync="false" src="${NATIVE_INVOKE_URL}"><\/script>
<div id="${NATIVE_CONTAINER_ID}"></div>
</body>
</html>`
  )
}

/** Banner 728x90 / 300x250 - 使用联盟提供的原始 atOptions 代码 */
export function loadBannerAd(container) {
  if (!container) return

  container.innerHTML = ''

  const { width, height } = getBannerSize()
  const options = {
    key: BANNER_KEY,
    format: 'iframe',
    height,
    width,
    params: {},
  }

  const iframe = createAdIframe(container, width, height)
  writeIframeHtml(
    iframe,
    `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;overflow:hidden;">
<script type="text/javascript">
  atOptions = ${JSON.stringify(options)};
<\/script>
<script type="text/javascript" src="${BANNER_INVOKE_URL}"><\/script>
</body>
</html>`
  )
}
