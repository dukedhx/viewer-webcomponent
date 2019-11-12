import WebComponent from './webComponent'
import { getPromise, triggerEvent } from './utils'
import { startPromisePrefix, viewerCreatedEvent } from './config'
import validators from './validators'
export default class {
  constructor ({ name, delayLoad, models, env, container, useGUI, initOptions, viewerOptions, version }) {
    this.delayLoad = delayLoad
    this.version = version
    this.name = validators.isTrimmedString.validate(name, 'Not properly named!')
    this.models = validators.isArray.validate(models, 'No model load option provided!')
    this.container = validators.isObject.validate(container, 'No valid container provided!')
    this.useGUI = useGUI
    WebComponent.InitOptions[name] = Object.assign({ env: (models.length && models[0].url ? 'Local' : 'AutodeskProduction') }, initOptions)

    WebComponent.ViewerOptions[name] = viewerOptions
    WebComponent.ViewerLoaders[name] = this
  }

  init (deps) {
    getPromise('loadDependency').then(() => Promise.all((deps || []).map(dep => loadScript(dep))).then(() => this.start()))
  }

  start () {
    if (this.delayLoad) this.delayLoad = false
    else if (WebComponent.state.loaded) this.loadViewer()
  }

  terminate () {
    this.viewer.finish()
    this.loaded = this.starting = false
  }

  loadViewer () {
    this.starting = true
    return new Promise(resolve => Autodesk.Viewing.Initializer(Object.assign(WebComponent.Defaults.InitOptions, WebComponent.InitOptions[this.name]), () => {
      this.viewer = WebComponent.Viewers[this.name] = this.initViewer()
      triggerEvent(viewerCreatedEvent, { viewer: this.viewer, name: this.name })
      this.models.forEach(m => this.loadModel(m.name))

      resolve(this.loaded = true)
    }))
  }

  loadModel (modelName) {
    const loadOptions = Object.assign({}, WebComponent.Defaults.LoadOptions, WebComponent.LoadOptions[modelName])
    if (typeof loadOptions.loadHandler === 'function') return loadOptions.loadHandler(this.viewer, loadOptions)
    else {
      return new Promise((resolve, reject) => {
        if (loadOptions.urn) {
          try {
            const urn = window.atob(loadOptions.urn.replace('urn:', ''))
          } catch (ex) { loadOptions.urn = btoa(loadOptions.urn) }
          Autodesk.Viewing.Document.load(loadOptions.urn.indexOf('urn:') == 0 ? loadOptions.urn : ('urn:' + loadOptions.urn), doc => {
            const view = doc.getRoot().search(Object.assign({ type: 'geometry' }, loadOptions.type ? { type: loadOptions.type } : null, loadOptions['view-name'] ? { name: loadOptions['view-name'] } : null, loadOptions.guid ? { guid: loadOptions.guid } : null))[0]
            this.viewer.start()

            if (this.version[0] > 5) {
              this.viewer.loadDocumentNode(doc, view, loadOptions.option, e => resolve(e), e => reject(e))
            } else { loadOptions.url = doc.getViewablePath(view) }
          })
        }

        this.viewer[this.viewer.started ? 'loadModel' : 'start'](loadOptions.url, loadOptions, e => { (loadOptions.loadSuccessCallback || (() => {}))(); resolve(e) }, e => { (loadOptions.loadFailureCallback || (() => {}))(); reject(e) })
      })
    }
  }

  initViewer () {
    return new (this.useGUI ? Autodesk.Viewing.Private.GuiViewer3D : Autodesk.Viewing.Private.Viewer3D)(this.container, Object.assign({}, WebComponent.ViewerOptions[this.name], WebComponent.Defaults.ViewerOptions))
  }
}
