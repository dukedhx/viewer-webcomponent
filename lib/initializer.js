
import { viewerCSSURLBase, viewerJSURLBase, defaultViewerVersion, defaultModelLoadOptions } from './config'
import { getViewerLoadObject, parseObjectFromContent, generateRandomEleId, createStyleElement, createStyleLink, loadScript, createViewerStyle, getPromise } from './utils'
import { generateRandomString } from './tools'
import ViewerLoader from './viewerLoader'
import WebComponent from './webComponent'
export default function () {
  window.customElements.define('forge-viewer', class ForgeViewer extends HTMLElement {
    constructor () {
      super()
      const modelOptions = Object.assign({}, defaultModelLoadOptions, parseObjectFromContent((this.querySelector('model-options') || {}).textContent))

      const viewerLoadObjects = Array.prototype.map.call(this.querySelectorAll('model') || [], e => getViewerLoadObject(e, modelOptions))
      const styles = (this.querySelector('css') || {}).textContent
      let version = this.getAttribute('version') || defaultViewerVersion
      if (version.length == '1')version += '.*'
      const name = this.getAttribute('name') || generateRandomString()
      const delayLoad = this.getAttribute('delay-load') === 'true'
      const useGUI = this.getAttribute('GUI') !== 'false'
      const shadowmode = this.getAttribute('shadow-mode') === 'true'
      const root = (!useGUI && this.getAttribute('shadow-mode') !== 'false') || shadowmode ? this.attachShadow({ mode: 'open' }) : this

      const initOptions = Object.assign({ accessToken: this.getAttribute('access-token') }, parseObjectFromContent((this.querySelector('init-options') || this.querySelector('options') || {}).textContent))

      const viewerOptions = parseObjectFromContent((this.querySelector('viewer-options') || this.querySelector('options') || {}).textContent)

      const container = document.createElement('div')
      container.id = this.getAttribute('container-id') || generateRandomEleId()

      container.className = this.getAttribute('class') || ''

      createViewerStyle({ id: container.id, css: this.getAttribute('css'), height: this.getAttribute('height'), width: this.getAttribute('width'), position: this.getAttribute('position'), left: this.getAttribute('left'), top: this.getAttribute('top'), right: this.getAttribute('right'), bottom: this.getAttribute('bottom') })

      this.innerHTML = ''
      root.appendChild(container)
      styles && createStyleElement(styles, shadowmode ? root : null)

      const deps = Array.prototype.map.call(this.querySelectorAll('dependency') || [], e => e.getAttribute('src'))

      if (!WebComponent.state.loaded) { getPromise('loadDependency', Promise.all([createStyleLink(viewerCSSURLBase + version, shadowmode ? root : null), loadScript(viewerJSURLBase + version)]).then(() => WebComponent.state.loaded = true)) }

      new ViewerLoader({ version, deps, delayLoad, initOptions, viewerOptions, models: viewerLoadObjects, useGUI, container, name }).init()
    }
  })
}
