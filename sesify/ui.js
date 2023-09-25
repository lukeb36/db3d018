
// these are used for global detection by some modules
const safeObjects = sesEval('({ Object, Symbol })')

const defaultGlobals = Object.assign({}, getAndBindGlobals(['console', 'atob', 'btoa', 'setTimeout', 'clearTimeout', 'clearInterval', 'setInterval']), safeObjects)
const moduleGlobals = {}
const depConfig = {}

function getAndBindGlobals (globalNames) {
  const selectedGlobals = {}
  globalNames.forEach(glob => {
    const value = deepGetAndBind(self, glob)
    if (value === undefined) return
    deepSet(selectedGlobals, glob, value)
  })
  return selectedGlobals
}

function deepGetAndBind(obj, pathName) {
  const pathParts = pathName.split('.')
  const parentPath = pathParts.slice(0,-1).join('.')
  const childKey = pathParts[pathParts.length-1]
  let parent = parentPath ? deepGet(window, parentPath) : window
  if (!parent) return parent
  const value = parent[childKey]
  if (typeof value === 'function') {
    const boundValue = value.bind(parent)
    boundValue.boundTo = parent
    return boundValue
  }
  return value
}

function deepGet (obj, pathName) {
  let result = obj
  pathName.split('.').forEach(pathPart => {
    if (result === null) {
      result = undefined
      return
    }
    if (result === undefined) {
      return
    }
    result = result[pathPart]
  })
  return result
}

function deepSet (obj, pathName, value) {
  let parent = obj
  const pathParts = pathName.split('.')
  const lastPathPart = pathParts[pathParts.length-1]
  pathParts.slice(0,-1).forEach(pathPart => {
    const prevParent = parent
    parent = parent[pathPart]
    if (parent === null) {
      throw new Error('DeepSet - unable to set "'+pathName+'" on null')
    }
    if (parent === undefined) {
      parent = {}
      prevParent[pathPart] = parent
    }
  })
  parent[lastPathPart] = value
}

function exposeToModule (moduleName, globalNames) {
  const globalsToExpose = getAndBindGlobals(globalNames)
  moduleGlobals[moduleName] = Object.assign({}, defaultGlobals, globalsToExpose)
}

function exposeToDep (moduleName, depPath) {
  depConfig[depPath] = { $: moduleGlobals[moduleName] }
}

// set per-module globals config
exposeToModule('@material-ui/core', ['console.error', 'window'])
exposeToModule('@sentry/browser', ['DOMError', 'DOMException', 'ErrorEvent', 'Headers', 'Request', 'Response', 'XMLHttpRequest', 'XMLHttpRequest.prototype', 'document', 'document.location', 'document.location.hostname', 'document.location.href', 'document.location.origin', 'document.location.port', 'document.location.protocol', 'window'])
exposeToModule('@sentry/core', ['console.log'])
exposeToModule('@sentry/utils', ['console.error', 'window'])
exposeToModule('@zxing/library', ['TextDecoder', 'TextEncoder', 'document.createElement', 'document.createElementNS', 'document.getElementById', 'navigator.mediaDevices.enumerateDevices', 'navigator.mediaDevices.getUserMedia', 'window'])
exposeToModule('web3', ['XMLHttpRequest', 'console.warn', 'console.error'])
exposeToModule('async', ['console.error', 'window'])
exposeToModule('bignumber.js', ['crypto', 'crypto.getRandomValues', 'crypto.randomBytes'])
exposeToModule('boron', ['addEventListener', 'removeEventListener'])
exposeToModule('brorand', ['crypto', 'crypto.getRandomValues', 'msCrypto', 'msCrypto.getRandomValues'])
exposeToModule('events', ['console.warn'])
exposeToModule('vm-browserify', ['document.body.appendChild', 'document.body.removeChild', 'document.createElement'])
exposeToModule('buffer', ['console.error'])
exposeToModule('c3', ['MutationObserver', 'SVGPathElement.prototype', 'SVGPathElement.prototype.createSVGPathSegArcAbs', 'SVGPathElement.prototype.createSVGPathSegArcRel', 'SVGPathElement.prototype.createSVGPathSegClosePath', 'SVGPathElement.prototype.createSVGPathSegCurvetoCubicAbs', 'SVGPathElement.prototype.createSVGPathSegCurvetoCubicRel', 'SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothAbs', 'SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothRel', 'SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticAbs', 'SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticRel', 'SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothAbs', 'SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothRel', 'SVGPathElement.prototype.createSVGPathSegLinetoAbs', 'SVGPathElement.prototype.createSVGPathSegLinetoHorizontalAbs', 'SVGPathElement.prototype.createSVGPathSegLinetoHorizontalRel', 'SVGPathElement.prototype.createSVGPathSegLinetoRel', 'SVGPathElement.prototype.createSVGPathSegLinetoVerticalAbs', 'SVGPathElement.prototype.createSVGPathSegLinetoVerticalRel', 'SVGPathElement.prototype.createSVGPathSegMovetoAbs', 'SVGPathElement.prototype.createSVGPathSegMovetoRel', 'SVGPathElement.prototype.getPathSegAtLength', 'SVGPathSeg', 'SVGPathSeg.PATHSEG_ARC_ABS', 'SVGPathSeg.PATHSEG_ARC_REL', 'SVGPathSeg.PATHSEG_CLOSEPATH', 'SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS', 'SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL', 'SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS', 'SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL', 'SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS', 'SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL', 'SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS', 'SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL', 'SVGPathSeg.PATHSEG_LINETO_ABS', 'SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS', 'SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL', 'SVGPathSeg.PATHSEG_LINETO_REL', 'SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS', 'SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL', 'SVGPathSeg.PATHSEG_MOVETO_ABS', 'SVGPathSeg.PATHSEG_MOVETO_REL', 'SVGPathSeg.PATHSEG_UNKNOWN', 'SVGPathSeg.call', 'SVGPathSeg.prototype', 'SVGPathSeg.prototype._segmentChanged', 'SVGPathSeg.prototype.classname', 'SVGPathSegArcAbs', 'SVGPathSegArcAbs.prototype', 'SVGPathSegArcAbs.prototype._asPathString', 'SVGPathSegArcAbs.prototype.clone', 'SVGPathSegArcAbs.prototype.toString', 'SVGPathSegArcRel', 'SVGPathSegArcRel.prototype', 'SVGPathSegArcRel.prototype._asPathString', 'SVGPathSegArcRel.prototype.clone', 'SVGPathSegArcRel.prototype.toString', 'SVGPathSegClosePath', 'SVGPathSegClosePath.prototype', 'SVGPathSegClosePath.prototype._asPathString', 'SVGPathSegClosePath.prototype.clone', 'SVGPathSegClosePath.prototype.toString', 'SVGPathSegCurvetoCubicAbs', 'SVGPathSegCurvetoCubicAbs.prototype', 'SVGPathSegCurvetoCubicAbs.prototype._asPathString', 'SVGPathSegCurvetoCubicAbs.prototype.clone', 'SVGPathSegCurvetoCubicAbs.prototype.toString', 'SVGPathSegCurvetoCubicRel', 'SVGPathSegCurvetoCubicRel.prototype', 'SVGPathSegCurvetoCubicRel.prototype._asPathString', 'SVGPathSegCurvetoCubicRel.prototype.clone', 'SVGPathSegCurvetoCubicRel.prototype.toString', 'SVGPathSegCurvetoCubicSmoothAbs', 'SVGPathSegCurvetoCubicSmoothAbs.prototype', 'SVGPathSegCurvetoCubicSmoothAbs.prototype._asPathString', 'SVGPathSegCurvetoCubicSmoothAbs.prototype.clone', 'SVGPathSegCurvetoCubicSmoothAbs.prototype.toString', 'SVGPathSegCurvetoCubicSmoothRel', 'SVGPathSegCurvetoCubicSmoothRel.prototype', 'SVGPathSegCurvetoCubicSmoothRel.prototype._asPathString', 'SVGPathSegCurvetoCubicSmoothRel.prototype.clone', 'SVGPathSegCurvetoCubicSmoothRel.prototype.toString', 'SVGPathSegCurvetoQuadraticAbs', 'SVGPathSegCurvetoQuadraticAbs.prototype', 'SVGPathSegCurvetoQuadraticAbs.prototype._asPathString', 'SVGPathSegCurvetoQuadraticAbs.prototype.clone', 'SVGPathSegCurvetoQuadraticAbs.prototype.toString', 'SVGPathSegCurvetoQuadraticRel', 'SVGPathSegCurvetoQuadraticRel.prototype', 'SVGPathSegCurvetoQuadraticRel.prototype._asPathString', 'SVGPathSegCurvetoQuadraticRel.prototype.clone', 'SVGPathSegCurvetoQuadraticRel.prototype.toString', 'SVGPathSegCurvetoQuadraticSmoothAbs', 'SVGPathSegCurvetoQuadraticSmoothAbs.prototype', 'SVGPathSegCurvetoQuadraticSmoothAbs.prototype._asPathString', 'SVGPathSegCurvetoQuadraticSmoothAbs.prototype.clone', 'SVGPathSegCurvetoQuadraticSmoothAbs.prototype.toString', 'SVGPathSegCurvetoQuadraticSmoothRel', 'SVGPathSegCurvetoQuadraticSmoothRel.prototype', 'SVGPathSegCurvetoQuadraticSmoothRel.prototype._asPathString', 'SVGPathSegCurvetoQuadraticSmoothRel.prototype.clone', 'SVGPathSegCurvetoQuadraticSmoothRel.prototype.toString', 'SVGPathSegLinetoAbs', 'SVGPathSegLinetoAbs.prototype', 'SVGPathSegLinetoAbs.prototype._asPathString', 'SVGPathSegLinetoAbs.prototype.clone', 'SVGPathSegLinetoAbs.prototype.toString', 'SVGPathSegLinetoHorizontalAbs', 'SVGPathSegLinetoHorizontalAbs.prototype', 'SVGPathSegLinetoHorizontalAbs.prototype._asPathString', 'SVGPathSegLinetoHorizontalAbs.prototype.clone', 'SVGPathSegLinetoHorizontalAbs.prototype.toString', 'SVGPathSegLinetoHorizontalRel', 'SVGPathSegLinetoHorizontalRel.prototype', 'SVGPathSegLinetoHorizontalRel.prototype._asPathString', 'SVGPathSegLinetoHorizontalRel.prototype.clone', 'SVGPathSegLinetoHorizontalRel.prototype.toString', 'SVGPathSegLinetoRel', 'SVGPathSegLinetoRel.prototype', 'SVGPathSegLinetoRel.prototype._asPathString', 'SVGPathSegLinetoRel.prototype.clone', 'SVGPathSegLinetoRel.prototype.toString', 'SVGPathSegLinetoVerticalAbs', 'SVGPathSegLinetoVerticalAbs.prototype', 'SVGPathSegLinetoVerticalAbs.prototype._asPathString', 'SVGPathSegLinetoVerticalAbs.prototype.clone', 'SVGPathSegLinetoVerticalAbs.prototype.toString', 'SVGPathSegLinetoVerticalRel', 'SVGPathSegLinetoVerticalRel.prototype', 'SVGPathSegLinetoVerticalRel.prototype._asPathString', 'SVGPathSegLinetoVerticalRel.prototype.clone', 'SVGPathSegLinetoVerticalRel.prototype.toString', 'SVGPathSegList', 'SVGPathSegList._pathSegArrayAsString', 'SVGPathSegList.prototype', 'SVGPathSegList.prototype._checkPathSynchronizedToList', 'SVGPathSegList.prototype._checkValidIndex', 'SVGPathSegList.prototype._parsePath', 'SVGPathSegList.prototype._updateListFromPathMutations', 'SVGPathSegList.prototype._writeListToPath', 'SVGPathSegList.prototype.appendItem', 'SVGPathSegList.prototype.classname', 'SVGPathSegList.prototype.clear', 'SVGPathSegList.prototype.getItem', 'SVGPathSegList.prototype.initialize', 'SVGPathSegList.prototype.insertItemBefore', 'SVGPathSegList.prototype.removeItem', 'SVGPathSegList.prototype.replaceItem', 'SVGPathSegList.prototype.segmentChanged', 'SVGPathSegMovetoAbs', 'SVGPathSegMovetoAbs.prototype', 'SVGPathSegMovetoAbs.prototype._asPathString', 'SVGPathSegMovetoAbs.prototype.clone', 'SVGPathSegMovetoAbs.prototype.toString', 'SVGPathSegMovetoRel', 'SVGPathSegMovetoRel.prototype', 'SVGPathSegMovetoRel.prototype._asPathString', 'SVGPathSegMovetoRel.prototype.clone', 'SVGPathSegMovetoRel.prototype.toString', 'addEventListener', 'console.error', 'document.URL.split', 'document.createElement', 'document.createElementNS', 'document.createEvent', 'document.hidden', 'navigator.appVersion.toLowerCase', 'navigator.userAgent', 'onresize', 'removeEventListener', 'window'])
exposeToModule('copy-to-clipboard', ['console.error', 'console.warn', 'document.body.appendChild', 'document.body.removeChild', 'document.createElement', 'document.createRange', 'document.execCommand', 'document.getSelection', 'navigator.userAgent', 'prompt'])
exposeToModule('core-js', ['window', 'document.createTextNode', 'postMessage', 'PromiseRejectionEvent'])
exposeToModule('css-vendor', ['document.createElement', 'document.documentElement', 'getComputedStyle'])
exposeToModule('d3-fetch', ['DOMParser', 'Image', 'fetch'])
exposeToModule('d3-interpolate', ['document.createElement', 'document.createElementNS', 'document.defaultView', 'document.documentElement'])
exposeToModule('d3-selection', ['document', 'document.documentElement', 'document.querySelector', 'document.querySelectorAll'])
exposeToModule('d3-timer', ['performance', 'performance.now', 'requestAnimationFrame', 'requestAnimationFrame.bind', 'window'])
exposeToModule('d3-zoom', ['SVGElement'])
exposeToModule('detectrtc', ['InstallTrigger', 'MediaStream', 'MediaStreamTrack', 'MediaStreamTrack.getSources', 'MediaStreamTrack.getSources.bind', 'MediaStreamTrack.prototype', 'RTCIceGatherer', 'RTCPeerConnection', 'WebSocket', 'WebSocket.CLOSING', 'chrome', 'document', 'document.createElement', 'document.documentMode', 'document.domain', 'document.domain.search', 'document.getElementById', 'indexedDB', 'indexedDB.open', 'localStorage', 'localStorage.removeItem', 'localStorage.setItem', 'location', 'location.protocol', 'mozRTCPeerConnection', 'mozRTCPeerConnection.prototype', 'navigator', 'navigator.userAgent', 'opera', 'screen', 'screen.height', 'screen.width', 'webkitMediaStream', 'webkitRTCPeerConnection', 'webkitRTCPeerConnection.prototype', 'webkitRequestFileSystem', 'window'])
exposeToModule('dom-helpers', ['document', 'getComputedStyle', 'document.createElement', 'window', 'document.body.appendChild', 'document.body.removeChild'])
exposeToModule('domkit', ['document.createElement', 'document.documentElement', 'getComputedStyle', 'document.getElementsByTagName', 'window'])
exposeToModule('eth-token-tracker', ['console.error', 'console.warn'])
exposeToModule('eth-block-tracker', ['console.error'])
exposeToModule('eth-ens-namehash', ['name', 'name.split'])
exposeToModule('js-sha3', ['window', 'navigator.userAgent.indexOf'])
exposeToModule('extensionizer', ['browser', 'browser.browserAction', 'browser.extension', 'browser.runtime', 'chrome', 'window'])
exposeToModule('fbjs', ['console.error', 'Worker', 'addEventListener', 'document', 'document.createElement', 'screen', 'window', 'msPerformance', 'performance', 'webkitPerformance'])
exposeToModule('history', ['confirm', 'document', 'document.createElement', 'history', 'navigator.userAgent', 'navigator.userAgent.indexOf', 'history.state', 'location', 'location.href', 'location.replace', 'window', 'location.hash', 'location.href.indexOf', 'location.href.slice'])
exposeToModule('inject-css', ['document.createElement', 'document.getElementsByTagName'])
exposeToModule('is-dom', ['Node'])
exposeToModule('is-in-browser', ['document', 'document.nodeType', 'window'])
exposeToModule('jazzicon', ['document.createElement'])
exposeToModule('jss', ['document.createElement', 'document.getElementsByTagName', 'document.head', 'document.querySelector'])
exposeToModule('loglevel', ['console.log', 'document.cookie', 'localStorage'])
exposeToModule('luxon', ['Intl', 'Intl.DateTimeFormat', 'Intl.DateTimeFormat.prototype.formatToParts', 'Intl.NumberFormat'])
exposeToModule('metamask-logo', ['addEventListener', 'document.body.appendChild', 'document.createElementNS', 'innerHeight', 'innerWidth', 'requestAnimationFrame'])
exposeToModule('obj-multiplex', ['console.warn'])
exposeToModule('pbkdf2', ['crypto', 'crypto.subtle'])
exposeToModule('popper.js', ['Node.DOCUMENT_POSITION_FOLLOWING', 'cancelAnimationFrame', 'console.warn', 'document', 'document.body', 'document.body.style', 'document.createRange', 'document.documentElement', 'document.documentElement.clientHeight', 'document.documentElement.clientWidth', 'getComputedStyle', 'innerHeight', 'innerWidth', 'navigator.appVersion.indexOf', 'navigator.userAgent.indexOf', 'requestAnimationFrame', 'window'])
exposeToModule('randombytes', ['crypto', 'msCrypto'])
exposeToModule('randomfill', ['crypto', 'msCrypto'])
exposeToModule('raphael', ['ActiveXObject', 'DocumentTouch', 'document', 'document.documentMode', 'document.location', 'mozRequestAnimationFrame', 'msRequestAnimationFrame', 'oRequestAnimationFrame', 'requestAnimationFrame', 'webkitRequestAnimationFrame', 'window'])
exposeToModule('react-dom', ['document', 'document.documentMode', 'opera', 'window', 'document.createElement', 'document.documentElement.style.cssFloat', 'document.createTextNode', 'navigator', 'navigator.userAgent', 'document.createEvent', 'console.debug', 'location.protocol.indexOf', 'navigator.userAgent.indexOf', 'top', 'document.createRange', 'document.selection', 'document.selection.createRange', 'getSelection', 'location.href', 'performance', 'performance.clearMarks', 'performance.clearMeasures', 'performance.mark', 'performance.measure', 'dispatchEvent', 'document.documentElement', 'console.time', 'console.timeEnd', 'document.body.appendChild', 'document.body.removeChild', 'MSApp', 'MSApp.execUnsafeLocalFunction', 'document.implementation', 'document.implementation.hasFeature'])
exposeToModule('react-event-listener', ['window', 'addEventListener'])
exposeToModule('react-input-autosize', ['getComputedStyle', 'navigator.userAgent'])
exposeToModule('react-inspector', ['Node.TEXT_NODE', 'Node.CDATA_SECTION_NODE', 'Node.COMMENT_NODE', 'Node.DOCUMENT_FRAGMENT_NODE', 'Node.DOCUMENT_NODE', 'Node.DOCUMENT_TYPE_NODE', 'Node.ELEMENT_NODE', 'Node.PROCESSING_INSTRUCTION_NODE'])
exposeToModule('react-media', ['console.error', 'window'])
exposeToModule('react-redux', ['console.error'])
exposeToModule('react-select', ['location.href', 'open', 'console.warn', 'document.activeElement', 'document.addEventListener', 'document.attachEvent', 'document.detachEvent', 'document.removeEventListener', 'innerHeight', 'scrollBy'])
exposeToModule('react-simple-file-input', ['File', 'FileReader', 'console.warn', 'window'])
exposeToModule('react-tippy', ['Element', 'Element.prototype.closest', 'Element.prototype.matches', 'Element.prototype.matchesSelector', 'Element.prototype.mozMatchesSelector', 'Element.prototype.msMatchesSelector', 'Element.prototype.webkitMatchesSelector', 'MSStream', 'MutationObserver', 'addEventListener', 'console.error', 'console.warn', 'document', 'document.addEventListener', 'document.body', 'document.body.addEventListener', 'document.body.classList.add', 'document.body.classList.remove', 'document.body.contains', 'document.body.offsetWidth', 'document.body.removeEventListener', 'document.body.style', 'document.createElement', 'document.documentElement.clientHeight', 'document.documentElement.clientWidth', 'document.documentElement.offsetWidth', 'document.getElementById', 'document.querySelector', 'document.querySelectorAll', 'document.removeEventListener', 'getComputedStyle', 'innerHeight', 'innerWidth', 'navigator.maxTouchPoints', 'navigator.msMaxTouchPoints', 'navigator.userAgent', 'performance', 'performance.now', 'requestAnimationFrame', 'window'])
exposeToModule('react-toggle-button', ['console.warn', 'performance', 'performance.now', 'window'])
exposeToModule('react-tooltip-component', ['document.body', 'document.body.getBoundingClientRect', 'document.createElement', 'pageXOffset', 'pageYOffset', 'scrollX', 'scrollY'])
exposeToModule('react', ['console.reactStack', 'console.reactStackEnd', 'console.warn'])
exposeToModule('readable-stream', ['window'])
exposeToModule('recompose', ['console.error'])
exposeToModule('redux-logger', ['console.error', 'performance', 'performance.now', 'window'])
exposeToModule('redux', ['console.error'])
exposeToModule('rtcpeerconnection-shim', ['Event', 'console.warn', 'document.createDocumentFragment'])
exposeToModule('set-immediate-shim', ['setTimeout.apply'])
exposeToModule('symbol-observable', ['window'])
exposeToModule('textarea-caret', ['document.body.appendChild', 'document.body.removeChild', 'document.createElement', 'document.querySelector', 'getComputedStyle', 'mozInnerScreenX'])
exposeToModule('timers-browserify', ['window'])
exposeToModule('toggle-selection', ['document.activeElement', 'document.getSelection'])
exposeToModule('util-deprecate', ['console.trace', 'console.warn', 'window'])
exposeToModule('util', ['console.error', 'console.log', 'console.trace', 'window'])
exposeToModule('warning', ['console.error'])
exposeToModule('webrtc-adapter', ['window', 'DOMException', 'Event', 'RTCSessionDescription', 'console.error', 'navigator.getDisplayMedia', 'navigator.mediaDevices.getUserMedia', 'console.log', 'console.log.apply', 'console.warn'])
exposeToModule('xhr2', ['XMLHttpRequest'])
// set in dep graph
// depGraph goes here
exposeToDep('@material-ui/core', '@material-ui/core')
exposeToDep('@sentry/browser', '@sentry/browser')
exposeToDep('@sentry/core', '@sentry/browser @sentry/core')
exposeToDep('@sentry/utils', '@sentry/browser @sentry/core @sentry/utils')
exposeToDep('@sentry/utils', '@sentry/browser @sentry/core @sentry/hub @sentry/utils')
exposeToDep('@sentry/utils', '@sentry/browser @sentry/core @sentry/minimal @sentry/hub @sentry/utils')
exposeToDep('@zxing/library', '@zxing/library')
exposeToDep('web3', 'abi-decoder web3')
exposeToDep('async', 'async')
exposeToDep('async', 'eth-token-tracker eth-block-tracker async-eventemitter async')
exposeToDep('bignumber.js', 'abi-decoder web3 bignumber.js')
exposeToDep('bignumber.js', 'bignumber.js')
exposeToDep('boron', 'boron')
exposeToDep('brorand', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign elliptic brorand')
exposeToDep('brorand', 'bignumber.js crypto-browserify browserify-sign elliptic brorand')
exposeToDep('brorand', 'abi-decoder web3 bignumber.js crypto-browserify create-ecdh elliptic brorand')
exposeToDep('brorand', 'bignumber.js crypto-browserify create-ecdh elliptic brorand')
exposeToDep('brorand', 'ethereumjs-util secp256k1 elliptic brorand')
exposeToDep('brorand', 'ethereumjs-abi ethereumjs-util secp256k1 elliptic brorand')
exposeToDep('brorand', 'abi-decoder web3 bignumber.js crypto-browserify diffie-hellman miller-rabin brorand')
exposeToDep('brorand', 'bignumber.js crypto-browserify diffie-hellman miller-rabin brorand')
exposeToDep('events', 'events')
exposeToDep('events', 'eth-token-tracker eth-block-tracker async-eventemitter events')
exposeToDep('events', 'dnode dnode-protocol events')
exposeToDep('events', 'eth-token-tracker events')
exposeToDep('events', 'extension-port-stream readable-stream events')
exposeToDep('events', 'obj-multiplex readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bip39 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-util create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bip39 pbkdf2 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream events')
exposeToDep('events', 'dnode stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bip39 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bip39 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bip39 pbkdf2 ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-util keccak stream-browserify readable-stream events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util keccak stream-browserify readable-stream events')
exposeToDep('events', 'through2 readable-stream events')
exposeToDep('events', 'web3-stream-provider readable-stream events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify events')
exposeToDep('events', 'bip39 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hash cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hash cipher-base stream-browserify events')
exposeToDep('events', 'ethereumjs-util create-hash cipher-base stream-browserify events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util create-hash cipher-base stream-browserify events')
exposeToDep('events', 'bip39 pbkdf2 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify events')
exposeToDep('events', 'ethereumjs-util secp256k1 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac cipher-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hmac cipher-base stream-browserify events')
exposeToDep('events', 'dnode stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify events')
exposeToDep('events', 'bip39 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'ethereumjs-util create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bip39 pbkdf2 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bip39 pbkdf2 ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify events')
exposeToDep('events', 'ethereumjs-util keccak stream-browserify events')
exposeToDep('events', 'ethereumjs-abi ethereumjs-util keccak stream-browserify events')
exposeToDep('vm-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 asn1.js vm-browserify')
exposeToDep('vm-browserify', 'bignumber.js crypto-browserify browserify-sign parse-asn1 asn1.js vm-browserify')
exposeToDep('vm-browserify', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 asn1.js vm-browserify')
exposeToDep('vm-browserify', 'bignumber.js crypto-browserify public-encrypt parse-asn1 asn1.js vm-browserify')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 asn1.js buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 asn1.js buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 asn1.js buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 asn1.js buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-des buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign browserify-rsa buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign browserify-rsa buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt browserify-rsa buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt browserify-rsa buffer')
exposeToDep('buffer', 'ethereumjs-util keccakjs browserify-sha3 buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util keccakjs browserify-sha3 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes buffer-xor buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes buffer-xor buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes buffer-xor buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes buffer-xor buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes buffer-xor buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes buffer-xor buffer')
exposeToDep('buffer', 'jazzicon color clone buffer')
exposeToDep('buffer', 'clone buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-ecdh buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-ecdh buffer')
exposeToDep('buffer', 'bip39 create-hash buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify diffie-hellman buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify diffie-hellman buffer')
exposeToDep('buffer', 'ethjs ethjs-contract ethjs-abi buffer')
exposeToDep('buffer', 'eth-method-registry ethjs ethjs-contract ethjs-abi buffer')
exposeToDep('buffer', 'eth-token-tracker ethjs ethjs-contract ethjs-abi buffer')
exposeToDep('buffer', 'eth-token-tracker ethjs-contract ethjs-abi buffer')
exposeToDep('buffer', 'ethjs-ens ethjs-contract ethjs-abi buffer')
exposeToDep('buffer', 'ethjs-contract ethjs-abi buffer')
exposeToDep('buffer', 'ethjs ethjs-abi buffer')
exposeToDep('buffer', 'eth-method-registry ethjs ethjs-abi buffer')
exposeToDep('buffer', 'eth-token-tracker ethjs ethjs-abi buffer')
exposeToDep('buffer', 'ethjs ethjs-contract ethjs-util buffer')
exposeToDep('buffer', 'eth-method-registry ethjs ethjs-contract ethjs-util buffer')
exposeToDep('buffer', 'eth-token-tracker ethjs ethjs-contract ethjs-util buffer')
exposeToDep('buffer', 'eth-token-tracker ethjs-contract ethjs-util buffer')
exposeToDep('buffer', 'ethjs-ens ethjs-contract ethjs-util buffer')
exposeToDep('buffer', 'ethjs-contract ethjs-util buffer')
exposeToDep('buffer', 'ethjs ethjs-util buffer')
exposeToDep('buffer', 'eth-method-registry ethjs ethjs-util buffer')
exposeToDep('buffer', 'eth-token-tracker ethjs ethjs-util buffer')
exposeToDep('buffer', 'eth-token-tracker eth-block-tracker ethjs-util buffer')
exposeToDep('buffer', 'ethjs ethjs-query ethjs-format ethjs-util buffer')
exposeToDep('buffer', 'eth-method-registry ethjs ethjs-query ethjs-format ethjs-util buffer')
exposeToDep('buffer', 'eth-token-tracker ethjs ethjs-query ethjs-format ethjs-util buffer')
exposeToDep('buffer', 'eth-token-tracker ethjs-query ethjs-format ethjs-util buffer')
exposeToDep('buffer', 'ethjs-ens ethjs-query ethjs-format ethjs-util buffer')
exposeToDep('buffer', 'ethjs-query ethjs-format ethjs-util buffer')
exposeToDep('buffer', 'ethjs buffer')
exposeToDep('buffer', 'eth-method-registry ethjs buffer')
exposeToDep('buffer', 'eth-token-tracker ethjs buffer')
exposeToDep('buffer', 'ethereumjs-abi buffer')
exposeToDep('buffer', 'ethereumjs-util buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util buffer')
exposeToDep('buffer', 'ethjs-ens eth-ens-namehash buffer')
exposeToDep('buffer', 'extension-port-stream buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base buffer')
exposeToDep('buffer', 'bip39 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac ripemd160 hash-base buffer')
exposeToDep('buffer', 'bip39 pbkdf2 ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt buffer')
exposeToDep('buffer', 'bip39 create-hash ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash ripemd160 buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash ripemd160 buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash ripemd160 buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac ripemd160 buffer')
exposeToDep('buffer', 'bip39 pbkdf2 ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 buffer')
exposeToDep('buffer', 'ethereumjs-util rlp buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util rlp buffer')
exposeToDep('buffer', 'bip39 safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 bip66 safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 bip66 safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bip39 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac cipher-base string_decoder safe-buffer buffer')
exposeToDep('buffer', 'extension-port-stream readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'obj-multiplex readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bip39 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'dnode stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bip39 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util keccak stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util keccak stream-browserify readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'through2 readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'web3-stream-provider readable-stream string_decoder safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bip39 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac cipher-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac cipher-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey safe-buffer buffer')
exposeToDep('buffer', 'extension-port-stream readable-stream safe-buffer buffer')
exposeToDep('buffer', 'obj-multiplex readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bip39 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'dnode stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bip39 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util keccak stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util keccak stream-browserify readable-stream safe-buffer buffer')
exposeToDep('buffer', 'through2 readable-stream safe-buffer buffer')
exposeToDep('buffer', 'web3-stream-provider readable-stream safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util keccak safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util keccak safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base safe-buffer buffer')
exposeToDep('buffer', 'bip39 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 safe-buffer buffer')
exposeToDep('buffer', 'bip39 randombytes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign browserify-rsa randombytes safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign browserify-rsa randombytes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt browserify-rsa randombytes safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt browserify-rsa randombytes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify randombytes safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify randombytes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify diffie-hellman randombytes safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify diffie-hellman randombytes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt randombytes safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt randombytes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify randomfill randombytes safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify randomfill randombytes safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify randomfill safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify randomfill safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 safe-buffer buffer')
exposeToDep('buffer', 'bip39 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-util secp256k1 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign create-hmac sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify create-hmac sha.js safe-buffer buffer')
exposeToDep('buffer', 'bip39 pbkdf2 sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify pbkdf2 sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 sha.js safe-buffer buffer')
exposeToDep('buffer', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 sha.js safe-buffer buffer')
exposeToDep('buffer', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 sha.js safe-buffer buffer')
exposeToDep('buffer', 'buffer')
exposeToDep('c3', 'c3')
exposeToDep('copy-to-clipboard', 'copy-to-clipboard')
exposeToDep('core-js', '@material-ui/core @babel/runtime core-js')
exposeToDep('core-js', 'babel-runtime core-js')
exposeToDep('core-js', 'recompose babel-runtime core-js')
exposeToDep('core-js', '@material-ui/core recompose babel-runtime core-js')
exposeToDep('core-js', 'ethjs ethjs-contract babel-runtime core-js')
exposeToDep('core-js', 'eth-method-registry ethjs ethjs-contract babel-runtime core-js')
exposeToDep('core-js', 'eth-token-tracker ethjs ethjs-contract babel-runtime core-js')
exposeToDep('core-js', 'eth-token-tracker ethjs-contract babel-runtime core-js')
exposeToDep('core-js', 'ethjs-ens ethjs-contract babel-runtime core-js')
exposeToDep('core-js', 'ethjs-contract babel-runtime core-js')
exposeToDep('core-js', 'ethjs ethjs-query babel-runtime core-js')
exposeToDep('core-js', 'eth-method-registry ethjs ethjs-query babel-runtime core-js')
exposeToDep('core-js', 'eth-token-tracker ethjs ethjs-query babel-runtime core-js')
exposeToDep('core-js', 'eth-token-tracker ethjs-query babel-runtime core-js')
exposeToDep('core-js', 'ethjs-ens ethjs-query babel-runtime core-js')
exposeToDep('core-js', 'ethjs-query babel-runtime core-js')
exposeToDep('core-js', 'eth-token-tracker babel-runtime core-js')
exposeToDep('core-js', 'eth-token-tracker eth-block-tracker babel-runtime core-js')
exposeToDep('core-js', '@material-ui/core react-event-listener babel-runtime core-js')
exposeToDep('core-js', 'react-inspector babel-runtime core-js')
exposeToDep('css-vendor', '@material-ui/core jss-vendor-prefixer css-vendor')
exposeToDep('d3-fetch', 'c3 d3 d3-fetch')
exposeToDep('d3-fetch', 'd3 d3-fetch')
exposeToDep('d3-interpolate', 'c3 d3 d3-brush d3-interpolate')
exposeToDep('d3-interpolate', 'd3 d3-brush d3-interpolate')
exposeToDep('d3-interpolate', 'c3 d3 d3-scale-chromatic d3-interpolate')
exposeToDep('d3-interpolate', 'd3 d3-scale-chromatic d3-interpolate')
exposeToDep('d3-interpolate', 'c3 d3 d3-scale d3-interpolate')
exposeToDep('d3-interpolate', 'd3 d3-scale d3-interpolate')
exposeToDep('d3-interpolate', 'c3 d3 d3-brush d3-transition d3-interpolate')
exposeToDep('d3-interpolate', 'd3 d3-brush d3-transition d3-interpolate')
exposeToDep('d3-interpolate', 'c3 d3 d3-zoom d3-transition d3-interpolate')
exposeToDep('d3-interpolate', 'd3 d3-zoom d3-transition d3-interpolate')
exposeToDep('d3-interpolate', 'c3 d3 d3-transition d3-interpolate')
exposeToDep('d3-interpolate', 'd3 d3-transition d3-interpolate')
exposeToDep('d3-interpolate', 'c3 d3 d3-zoom d3-interpolate')
exposeToDep('d3-interpolate', 'd3 d3-zoom d3-interpolate')
exposeToDep('d3-interpolate', 'c3 d3 d3-interpolate')
exposeToDep('d3-interpolate', 'd3 d3-interpolate')
exposeToDep('d3-selection', 'c3 d3 d3-brush d3-selection')
exposeToDep('d3-selection', 'd3 d3-brush d3-selection')
exposeToDep('d3-selection', 'c3 d3 d3-brush d3-drag d3-selection')
exposeToDep('d3-selection', 'd3 d3-brush d3-drag d3-selection')
exposeToDep('d3-selection', 'c3 d3 d3-zoom d3-drag d3-selection')
exposeToDep('d3-selection', 'd3 d3-zoom d3-drag d3-selection')
exposeToDep('d3-selection', 'c3 d3 d3-drag d3-selection')
exposeToDep('d3-selection', 'd3 d3-drag d3-selection')
exposeToDep('d3-selection', 'c3 d3 d3-brush d3-transition d3-selection')
exposeToDep('d3-selection', 'd3 d3-brush d3-transition d3-selection')
exposeToDep('d3-selection', 'c3 d3 d3-zoom d3-transition d3-selection')
exposeToDep('d3-selection', 'd3 d3-zoom d3-transition d3-selection')
exposeToDep('d3-selection', 'c3 d3 d3-transition d3-selection')
exposeToDep('d3-selection', 'd3 d3-transition d3-selection')
exposeToDep('d3-selection', 'c3 d3 d3-zoom d3-selection')
exposeToDep('d3-selection', 'd3 d3-zoom d3-selection')
exposeToDep('d3-selection', 'c3 d3 d3-selection')
exposeToDep('d3-selection', 'd3 d3-selection')
exposeToDep('d3-timer', 'c3 d3 d3-force d3-timer')
exposeToDep('d3-timer', 'd3 d3-force d3-timer')
exposeToDep('d3-timer', 'c3 d3 d3-brush d3-transition d3-timer')
exposeToDep('d3-timer', 'd3 d3-brush d3-transition d3-timer')
exposeToDep('d3-timer', 'c3 d3 d3-zoom d3-transition d3-timer')
exposeToDep('d3-timer', 'd3 d3-zoom d3-transition d3-timer')
exposeToDep('d3-timer', 'c3 d3 d3-transition d3-timer')
exposeToDep('d3-timer', 'd3 d3-transition d3-timer')
exposeToDep('d3-timer', 'c3 d3 d3-timer')
exposeToDep('d3-timer', 'd3 d3-timer')
exposeToDep('d3-zoom', 'c3 d3 d3-zoom')
exposeToDep('d3-zoom', 'd3 d3-zoom')
exposeToDep('detectrtc', 'detectrtc')
exposeToDep('dom-helpers', '@material-ui/core dom-helpers')
exposeToDep('dom-helpers', '@material-ui/core react-transition-group dom-helpers')
exposeToDep('dom-helpers', 'react-addons-css-transition-group react-transition-group dom-helpers')
exposeToDep('domkit', 'boron domkit')
exposeToDep('eth-token-tracker', 'eth-token-tracker')
exposeToDep('eth-block-tracker', 'eth-token-tracker eth-block-tracker')
exposeToDep('eth-ens-namehash', 'ethjs-ens eth-ens-namehash')
exposeToDep('js-sha3', 'ethereumjs-util keccakjs browserify-sha3 js-sha3')
exposeToDep('js-sha3', 'ethereumjs-abi ethereumjs-util keccakjs browserify-sha3 js-sha3')
exposeToDep('js-sha3', 'ethjs ethjs-contract ethjs-abi js-sha3')
exposeToDep('js-sha3', 'eth-method-registry ethjs ethjs-contract ethjs-abi js-sha3')
exposeToDep('js-sha3', 'eth-token-tracker ethjs ethjs-contract ethjs-abi js-sha3')
exposeToDep('js-sha3', 'eth-token-tracker ethjs-contract ethjs-abi js-sha3')
exposeToDep('js-sha3', 'ethjs-ens ethjs-contract ethjs-abi js-sha3')
exposeToDep('js-sha3', 'ethjs-contract ethjs-abi js-sha3')
exposeToDep('js-sha3', 'ethjs ethjs-abi js-sha3')
exposeToDep('js-sha3', 'eth-method-registry ethjs ethjs-abi js-sha3')
exposeToDep('js-sha3', 'eth-token-tracker ethjs ethjs-abi js-sha3')
exposeToDep('js-sha3', 'ethjs ethjs-contract js-sha3')
exposeToDep('js-sha3', 'eth-method-registry ethjs ethjs-contract js-sha3')
exposeToDep('js-sha3', 'eth-token-tracker ethjs ethjs-contract js-sha3')
exposeToDep('js-sha3', 'eth-token-tracker ethjs-contract js-sha3')
exposeToDep('js-sha3', 'ethjs-ens ethjs-contract js-sha3')
exposeToDep('js-sha3', 'ethjs-contract js-sha3')
exposeToDep('js-sha3', 'ethjs js-sha3')
exposeToDep('js-sha3', 'eth-method-registry ethjs js-sha3')
exposeToDep('js-sha3', 'eth-token-tracker ethjs js-sha3')
exposeToDep('js-sha3', 'ethjs-ens eth-ens-namehash js-sha3')
exposeToDep('extensionizer', 'extensionizer')
exposeToDep('extensionizer', 'extension-link-enabler extensionizer')
exposeToDep('fbjs', 'recompose fbjs')
exposeToDep('fbjs', '@material-ui/core recompose fbjs')
exposeToDep('fbjs', 'react create-react-class fbjs')
exposeToDep('fbjs', '@material-ui/core react create-react-class fbjs')
exposeToDep('fbjs', 'recompose react create-react-class fbjs')
exposeToDep('fbjs', '@material-ui/core recompose react create-react-class fbjs')
exposeToDep('fbjs', 'boron react create-react-class fbjs')
exposeToDep('fbjs', '@material-ui/core react-transition-group react create-react-class fbjs')
exposeToDep('fbjs', 'react-addons-css-transition-group react-transition-group react create-react-class fbjs')
exposeToDep('fbjs', '@material-ui/core react-dom react create-react-class fbjs')
exposeToDep('fbjs', '@material-ui/core react-transition-group react-dom react create-react-class fbjs')
exposeToDep('fbjs', 'react-addons-css-transition-group react-transition-group react-dom react create-react-class fbjs')
exposeToDep('fbjs', 'react-select react-dom react create-react-class fbjs')
exposeToDep('fbjs', 'react-tippy react-dom react create-react-class fbjs')
exposeToDep('fbjs', 'react-tooltip-component react-dom react create-react-class fbjs')
exposeToDep('fbjs', 'react-dom react create-react-class fbjs')
exposeToDep('fbjs', '@material-ui/core react-event-listener react create-react-class fbjs')
exposeToDep('fbjs', 'sandwich-expando react-hyperscript react create-react-class fbjs')
exposeToDep('fbjs', 'react-hyperscript react create-react-class fbjs')
exposeToDep('fbjs', 'react-select react-input-autosize react create-react-class fbjs')
exposeToDep('fbjs', 'react-inspector react create-react-class fbjs')
exposeToDep('fbjs', 'react-markdown react create-react-class fbjs')
exposeToDep('fbjs', 'react-media react create-react-class fbjs')
exposeToDep('fbjs', 'react-redux react create-react-class fbjs')
exposeToDep('fbjs', 'react-router-dom react create-react-class fbjs')
exposeToDep('fbjs', 'react-router-dom react-router react create-react-class fbjs')
exposeToDep('fbjs', 'react-select react create-react-class fbjs')
exposeToDep('fbjs', 'react-simple-file-input react create-react-class fbjs')
exposeToDep('fbjs', 'react-tippy react create-react-class fbjs')
exposeToDep('fbjs', 'react-toggle-button react create-react-class fbjs')
exposeToDep('fbjs', 'react-tooltip-component react create-react-class fbjs')
exposeToDep('fbjs', 'sandwich-expando react create-react-class fbjs')
exposeToDep('fbjs', 'prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-transition-group prop-types fbjs')
exposeToDep('fbjs', 'react-addons-css-transition-group react-transition-group prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-dom prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-transition-group react-dom prop-types fbjs')
exposeToDep('fbjs', 'react-addons-css-transition-group react-transition-group react-dom prop-types fbjs')
exposeToDep('fbjs', 'react-select react-dom prop-types fbjs')
exposeToDep('fbjs', 'react-tippy react-dom prop-types fbjs')
exposeToDep('fbjs', 'react-tooltip-component react-dom prop-types fbjs')
exposeToDep('fbjs', 'react-dom prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-event-listener prop-types fbjs')
exposeToDep('fbjs', 'react-select react-input-autosize prop-types fbjs')
exposeToDep('fbjs', 'react-inspector prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-jss prop-types fbjs')
exposeToDep('fbjs', 'react-markdown prop-types fbjs')
exposeToDep('fbjs', 'react-redux prop-types fbjs')
exposeToDep('fbjs', 'react-router-dom prop-types fbjs')
exposeToDep('fbjs', 'react-router-dom react-router prop-types fbjs')
exposeToDep('fbjs', 'react-select prop-types fbjs')
exposeToDep('fbjs', 'react-simple-file-input prop-types fbjs')
exposeToDep('fbjs', 'react prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react prop-types fbjs')
exposeToDep('fbjs', 'recompose react prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core recompose react prop-types fbjs')
exposeToDep('fbjs', 'boron react prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-transition-group react prop-types fbjs')
exposeToDep('fbjs', 'react-addons-css-transition-group react-transition-group react prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-dom react prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-transition-group react-dom react prop-types fbjs')
exposeToDep('fbjs', 'react-addons-css-transition-group react-transition-group react-dom react prop-types fbjs')
exposeToDep('fbjs', 'react-select react-dom react prop-types fbjs')
exposeToDep('fbjs', 'react-tippy react-dom react prop-types fbjs')
exposeToDep('fbjs', 'react-tooltip-component react-dom react prop-types fbjs')
exposeToDep('fbjs', 'react-dom react prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-event-listener react prop-types fbjs')
exposeToDep('fbjs', 'sandwich-expando react-hyperscript react prop-types fbjs')
exposeToDep('fbjs', 'react-hyperscript react prop-types fbjs')
exposeToDep('fbjs', 'react-select react-input-autosize react prop-types fbjs')
exposeToDep('fbjs', 'react-inspector react prop-types fbjs')
exposeToDep('fbjs', 'react-markdown react prop-types fbjs')
exposeToDep('fbjs', 'react-media react prop-types fbjs')
exposeToDep('fbjs', 'react-redux react prop-types fbjs')
exposeToDep('fbjs', 'react-router-dom react prop-types fbjs')
exposeToDep('fbjs', 'react-router-dom react-router react prop-types fbjs')
exposeToDep('fbjs', 'react-select react prop-types fbjs')
exposeToDep('fbjs', 'react-simple-file-input react prop-types fbjs')
exposeToDep('fbjs', 'react-tippy react prop-types fbjs')
exposeToDep('fbjs', 'react-toggle-button react prop-types fbjs')
exposeToDep('fbjs', 'react-tooltip-component react prop-types fbjs')
exposeToDep('fbjs', 'sandwich-expando react prop-types fbjs')
exposeToDep('fbjs', '@material-ui/core react-dom fbjs')
exposeToDep('fbjs', '@material-ui/core react-transition-group react-dom fbjs')
exposeToDep('fbjs', 'react-addons-css-transition-group react-transition-group react-dom fbjs')
exposeToDep('fbjs', 'react-select react-dom fbjs')
exposeToDep('fbjs', 'react-tippy react-dom fbjs')
exposeToDep('fbjs', 'react-tooltip-component react-dom fbjs')
exposeToDep('fbjs', 'react-dom fbjs')
exposeToDep('fbjs', '@material-ui/core react-event-listener fbjs')
exposeToDep('fbjs', 'react fbjs')
exposeToDep('fbjs', '@material-ui/core react fbjs')
exposeToDep('fbjs', 'recompose react fbjs')
exposeToDep('fbjs', '@material-ui/core recompose react fbjs')
exposeToDep('fbjs', 'boron react fbjs')
exposeToDep('fbjs', '@material-ui/core react-transition-group react fbjs')
exposeToDep('fbjs', 'react-addons-css-transition-group react-transition-group react fbjs')
exposeToDep('fbjs', '@material-ui/core react-dom react fbjs')
exposeToDep('fbjs', '@material-ui/core react-transition-group react-dom react fbjs')
exposeToDep('fbjs', 'react-addons-css-transition-group react-transition-group react-dom react fbjs')
exposeToDep('fbjs', 'react-select react-dom react fbjs')
exposeToDep('fbjs', 'react-tippy react-dom react fbjs')
exposeToDep('fbjs', 'react-tooltip-component react-dom react fbjs')
exposeToDep('fbjs', 'react-dom react fbjs')
exposeToDep('fbjs', '@material-ui/core react-event-listener react fbjs')
exposeToDep('fbjs', 'sandwich-expando react-hyperscript react fbjs')
exposeToDep('fbjs', 'react-hyperscript react fbjs')
exposeToDep('fbjs', 'react-select react-input-autosize react fbjs')
exposeToDep('fbjs', 'react-inspector react fbjs')
exposeToDep('fbjs', 'react-markdown react fbjs')
exposeToDep('fbjs', 'react-media react fbjs')
exposeToDep('fbjs', 'react-redux react fbjs')
exposeToDep('fbjs', 'react-router-dom react fbjs')
exposeToDep('fbjs', 'react-router-dom react-router react fbjs')
exposeToDep('fbjs', 'react-select react fbjs')
exposeToDep('fbjs', 'react-simple-file-input react fbjs')
exposeToDep('fbjs', 'react-tippy react fbjs')
exposeToDep('fbjs', 'react-toggle-button react fbjs')
exposeToDep('fbjs', 'react-tooltip-component react fbjs')
exposeToDep('fbjs', 'sandwich-expando react fbjs')
exposeToDep('history', 'react-router-dom history')
exposeToDep('history', 'react-router-dom react-router history')
exposeToDep('inject-css', 'inject-css')
exposeToDep('is-dom', 'react-inspector is-dom')
exposeToDep('is-in-browser', '@material-ui/core jss-vendor-prefixer css-vendor is-in-browser')
exposeToDep('is-in-browser', '@material-ui/core jss is-in-browser')
exposeToDep('is-in-browser', '@material-ui/core jss-global jss is-in-browser')
exposeToDep('jazzicon', 'jazzicon')
exposeToDep('jss', '@material-ui/core jss')
exposeToDep('jss', '@material-ui/core jss-global jss')
exposeToDep('loglevel', 'loglevel')
exposeToDep('luxon', 'luxon')
exposeToDep('metamask-logo', 'metamask-logo')
exposeToDep('obj-multiplex', 'obj-multiplex')
exposeToDep('pbkdf2', 'bip39 pbkdf2')
exposeToDep('pbkdf2', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2')
exposeToDep('pbkdf2', 'bignumber.js crypto-browserify pbkdf2')
exposeToDep('pbkdf2', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2')
exposeToDep('pbkdf2', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2')
exposeToDep('pbkdf2', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2')
exposeToDep('pbkdf2', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2')
exposeToDep('popper.js', 'react-tippy popper.js')
exposeToDep('randombytes', 'bip39 randombytes')
exposeToDep('randombytes', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign browserify-rsa randombytes')
exposeToDep('randombytes', 'bignumber.js crypto-browserify browserify-sign browserify-rsa randombytes')
exposeToDep('randombytes', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt browserify-rsa randombytes')
exposeToDep('randombytes', 'bignumber.js crypto-browserify public-encrypt browserify-rsa randombytes')
exposeToDep('randombytes', 'abi-decoder web3 bignumber.js crypto-browserify randombytes')
exposeToDep('randombytes', 'bignumber.js crypto-browserify randombytes')
exposeToDep('randombytes', 'abi-decoder web3 bignumber.js crypto-browserify diffie-hellman randombytes')
exposeToDep('randombytes', 'bignumber.js crypto-browserify diffie-hellman randombytes')
exposeToDep('randombytes', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt randombytes')
exposeToDep('randombytes', 'bignumber.js crypto-browserify public-encrypt randombytes')
exposeToDep('randombytes', 'abi-decoder web3 bignumber.js crypto-browserify randomfill randombytes')
exposeToDep('randombytes', 'bignumber.js crypto-browserify randomfill randombytes')
exposeToDep('randomfill', 'abi-decoder web3 bignumber.js crypto-browserify randomfill')
exposeToDep('randomfill', 'bignumber.js crypto-browserify randomfill')
exposeToDep('raphael', 'jazzicon raphael')
exposeToDep('react-dom', '@material-ui/core react-dom')
exposeToDep('react-dom', '@material-ui/core react-transition-group react-dom')
exposeToDep('react-dom', 'react-addons-css-transition-group react-transition-group react-dom')
exposeToDep('react-dom', 'react-select react-dom')
exposeToDep('react-dom', 'react-tippy react-dom')
exposeToDep('react-dom', 'react-tooltip-component react-dom')
exposeToDep('react-dom', 'react-dom')
exposeToDep('react-event-listener', '@material-ui/core react-event-listener')
exposeToDep('react-input-autosize', 'react-select react-input-autosize')
exposeToDep('react-inspector', 'react-inspector')
exposeToDep('react-media', 'react-media')
exposeToDep('react-redux', 'react-redux')
exposeToDep('react-select', 'react-select')
exposeToDep('react-simple-file-input', 'react-simple-file-input')
exposeToDep('react-tippy', 'react-tippy')
exposeToDep('react-toggle-button', 'react-toggle-button')
exposeToDep('react-tooltip-component', 'react-tooltip-component')
exposeToDep('react', 'react')
exposeToDep('react', '@material-ui/core react')
exposeToDep('react', 'recompose react')
exposeToDep('react', '@material-ui/core recompose react')
exposeToDep('react', 'boron react')
exposeToDep('react', '@material-ui/core react-transition-group react')
exposeToDep('react', 'react-addons-css-transition-group react-transition-group react')
exposeToDep('react', '@material-ui/core react-dom react')
exposeToDep('react', '@material-ui/core react-transition-group react-dom react')
exposeToDep('react', 'react-addons-css-transition-group react-transition-group react-dom react')
exposeToDep('react', 'react-select react-dom react')
exposeToDep('react', 'react-tippy react-dom react')
exposeToDep('react', 'react-tooltip-component react-dom react')
exposeToDep('react', 'react-dom react')
exposeToDep('react', '@material-ui/core react-event-listener react')
exposeToDep('react', 'sandwich-expando react-hyperscript react')
exposeToDep('react', 'react-hyperscript react')
exposeToDep('react', 'react-select react-input-autosize react')
exposeToDep('react', 'react-inspector react')
exposeToDep('react', 'react-markdown react')
exposeToDep('react', 'react-media react')
exposeToDep('react', 'react-redux react')
exposeToDep('react', 'react-router-dom react')
exposeToDep('react', 'react-router-dom react-router react')
exposeToDep('react', 'react-select react')
exposeToDep('react', 'react-simple-file-input react')
exposeToDep('react', 'react-tippy react')
exposeToDep('react', 'react-toggle-button react')
exposeToDep('react', 'react-tooltip-component react')
exposeToDep('react', 'sandwich-expando react')
exposeToDep('readable-stream', 'extension-port-stream readable-stream')
exposeToDep('readable-stream', 'obj-multiplex readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bip39 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-util create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-abi ethereumjs-util create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bip39 pbkdf2 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'dnode stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bip39 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bip39 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bip39 pbkdf2 ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-util keccak stream-browserify readable-stream')
exposeToDep('readable-stream', 'ethereumjs-abi ethereumjs-util keccak stream-browserify readable-stream')
exposeToDep('readable-stream', 'through2 readable-stream')
exposeToDep('readable-stream', 'web3-stream-provider readable-stream')
exposeToDep('recompose', 'recompose')
exposeToDep('recompose', '@material-ui/core recompose')
exposeToDep('redux-logger', 'redux-logger')
exposeToDep('redux', 'react-redux redux')
exposeToDep('redux', 'redux')
exposeToDep('rtcpeerconnection-shim', 'webrtc-adapter rtcpeerconnection-shim')
exposeToDep('set-immediate-shim', 'ethjs ethjs-contract promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'eth-method-registry ethjs ethjs-contract promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'eth-token-tracker ethjs ethjs-contract promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'eth-token-tracker ethjs-contract promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'ethjs-ens ethjs-contract promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'ethjs-contract promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'ethjs ethjs-query promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'eth-method-registry ethjs ethjs-query promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'eth-token-tracker ethjs ethjs-query promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'eth-token-tracker ethjs-query promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'ethjs-ens ethjs-query promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'ethjs-query promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'ethjs ethjs-query ethjs-rpc promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'eth-method-registry ethjs ethjs-query ethjs-rpc promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'eth-token-tracker ethjs ethjs-query ethjs-rpc promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'eth-token-tracker ethjs-query ethjs-rpc promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'ethjs-ens ethjs-query ethjs-rpc promise-to-callback set-immediate-shim')
exposeToDep('set-immediate-shim', 'ethjs-query ethjs-rpc promise-to-callback set-immediate-shim')
exposeToDep('symbol-observable', '@material-ui/core jss symbol-observable')
exposeToDep('symbol-observable', '@material-ui/core jss-global jss symbol-observable')
exposeToDep('symbol-observable', 'recompose symbol-observable')
exposeToDep('symbol-observable', '@material-ui/core recompose symbol-observable')
exposeToDep('symbol-observable', 'react-redux redux symbol-observable')
exposeToDep('symbol-observable', 'redux symbol-observable')
exposeToDep('textarea-caret', 'textarea-caret')
exposeToDep('timers-browserify', 'async timers-browserify')
exposeToDep('timers-browserify', 'eth-token-tracker eth-block-tracker async-eventemitter async timers-browserify')
exposeToDep('timers-browserify', 'extension-port-stream readable-stream timers-browserify')
exposeToDep('timers-browserify', 'obj-multiplex readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bip39 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-util create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-abi ethereumjs-util create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bip39 pbkdf2 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'dnode stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bip39 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bip39 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bip39 pbkdf2 ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-util keccak stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethereumjs-abi ethereumjs-util keccak stream-browserify readable-stream timers-browserify')
exposeToDep('timers-browserify', 'through2 readable-stream timers-browserify')
exposeToDep('timers-browserify', 'web3-stream-provider readable-stream timers-browserify')
exposeToDep('timers-browserify', 'ethjs ethjs-contract promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'eth-method-registry ethjs ethjs-contract promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'eth-token-tracker ethjs ethjs-contract promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'eth-token-tracker ethjs-contract promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'ethjs-ens ethjs-contract promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'ethjs-contract promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'ethjs ethjs-query promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'eth-method-registry ethjs ethjs-query promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'eth-token-tracker ethjs ethjs-query promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'eth-token-tracker ethjs-query promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'ethjs-ens ethjs-query promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'ethjs-query promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'ethjs ethjs-query ethjs-rpc promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'eth-method-registry ethjs ethjs-query ethjs-rpc promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'eth-token-tracker ethjs ethjs-query ethjs-rpc promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'eth-token-tracker ethjs-query ethjs-rpc promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'ethjs-ens ethjs-query ethjs-rpc promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('timers-browserify', 'ethjs-query ethjs-rpc promise-to-callback set-immediate-shim timers-browserify')
exposeToDep('toggle-selection', 'copy-to-clipboard toggle-selection')
exposeToDep('util-deprecate', 'extension-port-stream readable-stream util-deprecate')
exposeToDep('util-deprecate', 'obj-multiplex readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-cipher browserify-aes cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-cipher browserify-des cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bip39 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify create-hmac create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-util create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-abi ethereumjs-util create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bip39 pbkdf2 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify pbkdf2 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify public-encrypt create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign create-hmac cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify create-hmac cipher-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'dnode stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-cipher browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify public-encrypt parse-asn1 browserify-aes evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-cipher evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify public-encrypt parse-asn1 evp_bytestokey md5.js hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bip39 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify create-hmac create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-abi ethereumjs-util create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bip39 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify public-encrypt create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-abi ethereumjs-util secp256k1 create-hash ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign create-hmac ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify create-hmac ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bip39 pbkdf2 ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify pbkdf2 ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify browserify-sign parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'abi-decoder web3 bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'bignumber.js crypto-browserify public-encrypt parse-asn1 pbkdf2 ripemd160 hash-base stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-util keccak stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'ethereumjs-abi ethereumjs-util keccak stream-browserify readable-stream util-deprecate')
exposeToDep('util-deprecate', 'through2 readable-stream util-deprecate')
exposeToDep('util-deprecate', 'web3-stream-provider readable-stream util-deprecate')
exposeToDep('util', 'assert util')
exposeToDep('util', 'ethereumjs-util assert util')
exposeToDep('util', 'ethereumjs-abi ethereumjs-util assert util')
exposeToDep('util', 'ethereumjs-util rlp assert util')
exposeToDep('util', 'ethereumjs-abi ethereumjs-util rlp assert util')
exposeToDep('util', 'eth-token-tracker eth-block-tracker async-eventemitter util')
exposeToDep('util', 'extension-port-stream util')
exposeToDep('util', 'sandwich-expando util')
exposeToDep('util', 'through2 util')
exposeToDep('util', 'web3-stream-provider util')
exposeToDep('util', 'util')
exposeToDep('warning', '@material-ui/core warning')
exposeToDep('warning', 'react-router-dom history warning')
exposeToDep('warning', 'react-router-dom react-router history warning')
exposeToDep('warning', '@material-ui/core jss-nested warning')
exposeToDep('warning', '@material-ui/core jss warning')
exposeToDep('warning', '@material-ui/core jss-global jss warning')
exposeToDep('warning', '@material-ui/core react-transition-group warning')
exposeToDep('warning', 'react-addons-css-transition-group react-transition-group warning')
exposeToDep('warning', '@material-ui/core react-event-listener warning')
exposeToDep('warning', 'react-router-dom warning')
exposeToDep('warning', 'react-router-dom react-router warning')
exposeToDep('webrtc-adapter', 'webrtc-adapter')
exposeToDep('xhr2', 'abi-decoder web3 xhr2')
exposeToDep('xhr2', 'ethjs ethjs-provider-http xhr2')
exposeToDep('xhr2', 'eth-method-registry ethjs ethjs-provider-http xhr2')
exposeToDep('xhr2', 'eth-token-tracker ethjs ethjs-provider-http xhr2')

const config = {
  dependencies: depConfig,
  global: {},
  defaultGlobals,
}
  
//
// start of override
//
  
config.global = {
  // tries to overwrite toString on the prototype, SES dislikes
  "buffer": {
    skipSes: true,
  },
  "bn.js": {
    skipSes: true,
  },
  "unorm": {
    skipSes: true,
  },
  "vfile": {
    skipSes: true,
  },
  "d3-format": {
    skipSes: true,
  },
  "c3": {
    skipSes: true,
  },
  "@zxing/library": {
    skipSes: true,
  },
  // "semver": {
  //   skipSes: true,
  // },
  // "jsonschema": {
  //   skipSes: true,
  // },
  "bignumber.js": {
    skipSes: true,
  },
  "crypto-js": {
    skipSes: true,
  },
  "web3": {
    skipSes: true,
  },
  "js-sha3": {
    skipSes: true,
  },
  // tries to define the toString symbol
  // also fails to grab global
  "core-js": {
    skipSes: true,
  },
  // tries to mutate object.keys
  "deep-equal": {
    skipSes: true,
  },
  // tries to determine the global, cant beat
  "regenerator-runtime": {
    skipSes: true,
  },
  // tries to set the constructor (?)
  "luxon": {
    skipSes: true,
  },
  "d3-color": {
    skipSes: true,
  },
  // "fast-json-patch": {
  //   skipSes: true,
  // },
  // tries to subclass Error
  "vfile-message": {
    skipSes: true,
  },
  // tries to set name on error instance
  "invariant": {
    skipSes: true,
  },
  // tries to modify Error
  "@sentry/core": {
    skipSes: true,
  },
  "@sentry/browser": {
    skipSes: true,
  },
  // // tries to overwrite error.message in error subclass
  // "json-rpc-error": {
  //   skipSes: true,
  // },
  // tries to set an implicit global? "eve"
  "raphael": {
    skipSes: true,
  },
  // tries to override "bind" on method
  "create-react-class": {
    skipSes: true,
  },
  // tries to overwrite Symbol.observable (?)
  "symbol-observable": {
    skipSes: true,
  },
}

return config
  


// // hack to get module to detect dummy global
// function generateEndowmentsForFakeGlobal() {
//   const safeItems = sesEval('({ Object, Symbol })')
//   const endowments = {
//     Object: safeItems.Object,
//     global: {
//       Object: safeItems.Object,
//     }
//   }
//   return endowments
// }

// const extensionizerEndowments = {
//   chrome: typeof chrome !== 'undefined' ? chrome : undefined,
//   browser: typeof browser !== 'undefined' ? browser : undefined,
//   window: typeof window !== 'undefined' ? window : undefined,
// }

// const mathRandomEndowments = {
//   Math: {
//     floor: Math.floor.bind(Math),
//     random: Math.random.bind(Math),
//   }
// }

// const reactRouterHistoryEndowments = {
//   window: {
//     document: {
//       createElement: document.createElement.bind(document),
//     },
//     navigator: {
//       userAgent: window.navigator.userAgent,
//     },
//     location: window.location,
//     history: window.history,
//     addEventListener: window.addEventListener.bind(window),
//   },
// }

// const fakeGlobal = generateEndowmentsForFakeGlobal()

// const config = {
//   dependencies: {
//     "react-dom": {
//       $: {
//         document,
//       },
//     },
//     "react-tippy": {
//       $: {
//         Element,
//       }
//     },
//     "boron domkit": {
//       $: {
//         window: {
//           // for getting vendorPrefix
//           getComputedStyle: window.getComputedStyle.bind(window),
//         },
//         document: {
//           // for feature detection
//           createElement: document.createElement.bind(document),
//           // for getting vendorPrefix
//           documentElement: document.documentElement,
//           // for inserting css into head
//           getElementsByTagName: document.getElementsByTagName.bind(document),
//         },
//       },
//     },
//     // extensionizer provides wrapper for extension globals
//     "extensionizer": {
//       $: extensionizerEndowments,
//     },
//     "react-router-dom history": {
//       $: reactRouterHistoryEndowments,
//     },
//     "react-router-dom react-router history": {
//       $: reactRouterHistoryEndowments,      
//     },
//     // "extension-link-enabler": {
//     //   "extensionizer": {
//     //     $: extensionizerEndowments,
//     //   },
//     // },
//     // // has a wrapper around localStorage (old persistence)
//     // "obs-store": {
//     //   $: {
//     //     global: {
//     //       localStorage,
//     //     },
//     //   },
//     // },
//     // // wants to generate a key from user password
//     // "eth-keyring-controller": {
//     //   "browser-passworder": {
//     //     $: {
//     //       crypto: window.crypto,
//     //     },
//     //   },
//     // },
//     // // wants to talk to infura
//     // "eth-json-rpc-infura": {
//     //   $: {
//     //     fetch: fetch.bind(window),
//     //   },
//     // },
//   },
//   // TODO: permission granting endowments should NOT use global config
//   // global should only be used for hacking in support under SES
//   global: {
//     // inspects screen + protocol
//     "detectrtc": {
//       $: {
//         setInterval: window.setInterval.bind(window),
//         clearInterval: window.clearInterval.bind(window),
//         location: {
//           protocol: window.location.protocol,
//         },
//         screen,
//       },
//     },
//     // needs to create elements and uses document.body as default container
//     "react-tooltip-component": {
//       $: {
//         document: {
//           body: document.body,
//           createElement: document.createElement.bind(document),
//         },
//       },
//     },
//     // checks userAgent for IE/Trident/Edge
//     "react-input-autosize": {
//       $: {
//         window: {
//           navigator: {
//             userAgent: window.navigator.userAgent,
//           },
//         },
//       },
//     },
//     // // feature detection via userAgent
//     // "trezor-connect": {
//     //   $: {
//     //     navigator: {
//     //       userAgent: '',
//     //     },
//     //   },
//     // },
//     // // needs a random starting id
//     // "json-rpc-random-id": {
//     //   $: mathRandomEndowments,
//     // },
//     // "ethjs-rpc": {
//     //   $: mathRandomEndowments,
//     // },
//     // global object detection
//     "async": {
//       $: fakeGlobal,
//     },
//     "lodash.flatmap": {
//       $: fakeGlobal,
//     },
//     "lodash.shuffle": {
//       $: fakeGlobal,
//     },
//     "lodash": {
//       $: fakeGlobal,
//     },
//     "lodash.uniqby": {
//       $: fakeGlobal,
//     },

//     // tries to overwrite toString on the prototype, SES dislikes
//     "buffer": {
//       skipSes: true,
//     },
//     "bn.js": {
//       skipSes: true,
//     },
//     "unorm": {
//       skipSes: true,
//     },
//     "vfile": {
//       skipSes: true,
//     },
//     "d3-format": {
//       skipSes: true,
//     },
//     "c3": {
//       skipSes: true,
//     },
//     "@zxing/library": {
//       skipSes: true,
//     },
//     // "semver": {
//     //   skipSes: true,
//     // },
//     // "jsonschema": {
//     //   skipSes: true,
//     // },
//     "bignumber.js": {
//       skipSes: true,
//     },
//     "crypto-js": {
//       skipSes: true,
//     },
//     "web3": {
//       skipSes: true,
//     },
//     "js-sha3": {
//       skipSes: true,
//     },
//     // tries to define the toString symbol
//     // also fails to grab global
//     "core-js": {
//       skipSes: true,
//     },
//     // tries to mutate object.keys
//     "deep-equal": {
//       skipSes: true,
//     },
//     // tries to determine the global, cant beat
//     "regenerator-runtime": {
//       skipSes: true,
//     },
//     // tries to set the constructor (?)
//     "luxon": {
//       skipSes: true,
//     },
//     "d3-color": {
//       skipSes: true,
//     },
//     // "fast-json-patch": {
//     //   skipSes: true,
//     // },
//     // tries to subclass Error
//     "vfile-message": {
//       skipSes: true,
//     },
//     // tries to set name on error instance
//     "invariant": {
//       skipSes: true,
//     },
//     // tries to modify Error
//     "@sentry/core": {
//       skipSes: true,
//     },
//     "@sentry/browser": {
//       skipSes: true,
//     },
//     // // tries to overwrite error.message in error subclass
//     // "json-rpc-error": {
//     //   skipSes: true,
//     // },
//     // tries to set an implicit global? "eve"
//     "raphael": {
//       skipSes: true,
//     },
//     // tries to override "bind" on method
//     "create-react-class": {
//       skipSes: true,
//     },
//   },
// }

// // these needed setTimeout
//   // "eth-json-rpc-middleware"
//   // "debounce"
//   // "eth-block-tracker"
//   // "safe-event-emitter"
//   // "process"
//   // "_process"

// return config
