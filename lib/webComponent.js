
import { viewerCreatedEvent } from './config'
const WebComponent = {

  Defaults: {
    InitOptions: {},
    ViewerOptions: {},
    LoadOptions: {}
  },
  InitOptions: {},
  ViewerOptions: {},
  LoadOptions: {},
  getViewer,
  start,
  terminate,
  Promises: {},
  Viewers: {},
  state: { loaded: false },
  ViewerLoaders: {}

}

function terminate (name) {
  return Promise.all(name ? [WebComponent.ViewerLoaders[name]] : Object.entries(WebComponent.ViewerLoaders).map(e => new Promise(resolve => { e[1].terminate(); resolve() })))
}

function getViewer (name) {
  if (!name)name = Object.keys(WebComponent.Viewers)[0]
  return WebComponent.Viewers[name] ? Promise.resolve(WebComponent.Viewers[name]) : new Promise(resolve => {
    const listener = function (event) { if (!name || name == event.detail.name) { window.removeEventListener(viewerCreatedEvent, listener); resolve(event.detail.viewer) } }
    window.addEventListener(viewerCreatedEvent, listener)
  })
}

function start (name, delayed) {
  if (name) {
    WebComponent.ViewerLoaders[name].start()
  } else {
    Object.entries(WebComponent.ViewerLoaders).filter(e => !e[1].starting && !e[1].loaded).forEach(e => WebComponent.start(e[0]))
  }
}

export default WebComponent
