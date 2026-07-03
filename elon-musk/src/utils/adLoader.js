const BANNER_KEY = '385f4ce5ac081ca112b4243a2df1dac7'
const BANNER_INVOKE_URL = `https://www.highperformanceformat.com/${BANNER_KEY}/invoke.js`
const NATIVE_INVOKE_URL =
  'https://pl30178224.effectivecpmnetwork.com/0a998aed9549b428589f6b73e669343d/invoke.js'
const NATIVE_CONTAINER_ID = 'container-0a998aed9549b428589f6b73e669343d'
const POPUNDER_URL =
  'https://pl30178223.effectivecpmnetwork.com/81/84/76/81847652f01613b08da06d86629a2489.js'

const MOBILE_BREAKPOINT = 768

let popunderLoaded = false
let nativeLoadId = 0

export function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
}

export function loadPopunder() {
  if (popunderLoaded) return
  popunderLoaded = true

  const script = document.createElement('script')
  script.src = POPUNDER_URL
  document.body.appendChild(script)
}

/**
 * 联盟广告脚本依赖 document.write，必须通过 iframe 模拟初始 HTML 解析环境。
 */
function writeAdDocument(iframe, html) {
  const doc = iframe.contentWindow?.document
  if (!doc) return

  doc.open()
  doc.write(html)
  doc.close()
}

export function loadNativeBanner(container) {
  if (!container) return

  container.innerHTML = ''
  nativeLoadId += 1

  const iframe = document.createElement('iframe')
  iframe.title = 'Advertisement'
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('scrolling', 'no')
  iframe.style.border = 'none'
  iframe.style.width = '100%'
  iframe.style.minHeight = '280px'
  iframe.style.display = 'block'
  container.appendChild(iframe)

  writeAdDocument(
    iframe,
    `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;">
<script async="async" data-cfasync="false" src="${NATIVE_INVOKE_URL}?v=${nativeLoadId}"><\/script>
<div id="${NATIVE_CONTAINER_ID}"></div>
</body>
</html>`
  )
}

export function loadBannerAd(container) {
  if (!container) return

  container.innerHTML = ''

  const options = isMobileViewport()
    ? { key: BANNER_KEY, format: 'iframe', height: 250, width: 300, params: {} }
    : { key: BANNER_KEY, format: 'iframe', height: 90, width: 728, params: {} }

  const iframe = document.createElement('iframe')
  iframe.title = 'Advertisement'
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('scrolling', 'no')
  iframe.width = options.width
  iframe.height = options.height
  iframe.style.border = 'none'
  iframe.style.width = `${options.width}px`
  iframe.style.height = `${options.height}px`
  iframe.style.maxWidth = '100%'
  container.appendChild(iframe)

  writeAdDocument(
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
