const BANNER_KEY = '385f4ce5ac081ca112b4243a2df1dac7'
const BANNER_INVOKE_URL = `https://www.highperformanceformat.com/${BANNER_KEY}/invoke.js`
const NATIVE_INVOKE_URL =
  'https://pl30178224.effectivecpmnetwork.com/0a998aed9549b428589f6b73e669343d/invoke.js'
const NATIVE_CONTAINER_ID = 'container-0a998aed9549b428589f6b73e669343d'
const POPUNDER_URL =
  'https://pl30178223.effectivecpmnetwork.com/81/84/76/81847652f01613b08da06d86629a2489.js'

const MOBILE_BREAKPOINT = 768

let popunderLoaded = false
let bannerQueue = Promise.resolve()
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

/** 劫持 document.write，使动态加载的联盟脚本能在 SPA 中正常渲染 */
function hijackDocumentWrite(container) {
  const originalWrite = document.write.bind(document)
  const originalWriteln = document.writeln.bind(document)

  document.write = document.writeln = (html) => {
    container.insertAdjacentHTML('beforeend', html)
  }

  return () => {
    document.write = originalWrite
    document.writeln = originalWriteln
  }
}

export function loadNativeBanner(container) {
  if (!container) return

  container.innerHTML = ''
  nativeLoadId += 1

  const adDiv = document.createElement('div')
  adDiv.id = NATIVE_CONTAINER_ID
  container.appendChild(adDiv)

  const script = document.createElement('script')
  script.async = true
  script.setAttribute('data-cfasync', 'false')
  script.src = `${NATIVE_INVOKE_URL}?cb=${nativeLoadId}`
  document.body.appendChild(script)
}

export function loadBannerAd(container) {
  if (!container) return Promise.resolve()

  const options = isMobileViewport()
    ? { key: BANNER_KEY, format: 'iframe', height: 250, width: 300, params: {} }
    : { key: BANNER_KEY, format: 'iframe', height: 90, width: 728, params: {} }

  bannerQueue = bannerQueue.then(
    () =>
      new Promise((resolve) => {
        container.innerHTML = ''
        window.atOptions = options

        const restore = hijackDocumentWrite(container)

        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = BANNER_INVOKE_URL
        script.onload = () => {
          restore()
          resolve()
        }
        script.onerror = () => {
          restore()
          resolve()
        }
        document.body.appendChild(script)
      })
  )

  return bannerQueue
}

export function cleanupNativeBanner() {
  const existing = document.getElementById(NATIVE_CONTAINER_ID)
  if (existing) {
    existing.remove()
  }
}
