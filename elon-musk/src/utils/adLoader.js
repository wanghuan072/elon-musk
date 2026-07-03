const BANNER_KEY = '385f4ce5ac081ca112b4243a2df1dac7'
const BANNER_INVOKE_URL = `https://www.highperformanceformat.com/${BANNER_KEY}/invoke.js`
const NATIVE_INVOKE_URL =
  'https://pl30178224.effectivecpmnetwork.com/0a998aed9549b428589f6b73e669343d/invoke.js'
const NATIVE_CONTAINER_ID = 'container-0a998aed9549b428589f6b73e669343d'

const MOBILE_BREAKPOINT = 768

let bannerQueue = Promise.resolve()
let nativeLoadCounter = 0

export function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
}

export function getBannerSize() {
  return isMobileViewport()
    ? { width: 300, height: 250 }
    : { width: 728, height: 90 }
}

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

/**
 * Native Banner - 联盟原始代码，主页面直接加载（Referer = spendmusksmoney.org）
 */
export function loadNativeBanner(container) {
  if (!container) return

  container.innerHTML = ''
  nativeLoadCounter += 1

  const script = document.createElement('script')
  script.async = true
  script.setAttribute('data-cfasync', 'false')
  script.src = `${NATIVE_INVOKE_URL}?cb=${nativeLoadCounter}`

  const adDiv = document.createElement('div')
  adDiv.id = NATIVE_CONTAINER_ID

  container.appendChild(script)
  container.appendChild(adDiv)
}

/**
 * Banner - 联盟原始 atOptions + invoke.js
 */
export function loadBannerAd(container) {
  if (!container) return Promise.resolve()

  const { width, height } = getBannerSize()
  const options = {
    key: BANNER_KEY,
    format: 'iframe',
    height,
    width,
    params: {},
  }

  bannerQueue = bannerQueue.then(
    () =>
      new Promise((resolve) => {
        container.innerHTML = ''

        const optionsScript = document.createElement('script')
        optionsScript.type = 'text/javascript'
        optionsScript.text = `atOptions = ${JSON.stringify(options)};`
        container.appendChild(optionsScript)

        const restore = hijackDocumentWrite(container)

        const invokeScript = document.createElement('script')
        invokeScript.type = 'text/javascript'
        invokeScript.src = BANNER_INVOKE_URL
        invokeScript.onload = () => {
          restore()
          resolve()
        }
        invokeScript.onerror = () => {
          restore()
          resolve()
        }
        container.appendChild(invokeScript)
      })
  )

  return bannerQueue
}
