import WebComponent from './webComponent'
import { generateRandomString } from './tools'
function isValidURL (str) {
  const a = document.createElement('a')
  a.href = str
  return (a.host && a.host != window.location.host)
}

function throwException (msg) {
  if (msg) {
    if (isFunction(window.AutodeskForge.CallBackHandlers))window.AutodeskForge.CallBackHandlers(msg)
    else { throw msg }
  }
}

function parseObjectFromContent (content) {
  if (content && typeof content === 'string') {
    try {
      return JSON.parse(content)
    } catch (err) { console.error(err) }
  }
  return {}
}

function appendIfNaN (text, postfix, fb) {
  return isNaN(text) ? text : ((text || fb) + (isNaN(fb) ? '' : postfix))
}

function createViewerStyle ({ id, css, height, width, position, left, top, right, bottom }) {
  createStyleElement(`#${id} .adsk-viewing-viewer { ${css || ''}; ${height ? ('height:' + appendIfNaN(height, '%') + '!important;') : ''}  ${width ? ('width:' + appendIfNaN(width, '%', 100) + '!important;') : ''} ${position ? ('position:' + (['fixed', 'absolute'].includes(position) ? position : 'relative') + '!important;') : ''} ${left ? ('left:' + appendIfNaN(width, '%', 100) + '!important;') : ''} ${top ? ('top:' + appendIfNaN(top, '%', 'unset') + '!important;') : ''} ${right ? ('right:' + appendIfNaN(right, '%', 'unset') + '!important;') : ''} ${bottom ? ('bottom:' + appendIfNaN(bottom, '%', 'unset') + '!important') : ''}}`)
}

function mergeObject (assignee, assigner) {
  return Object.assign(assignee || {}, assigner)
}

function triggerEvent (eventName, data, opts) {
  window.dispatchEvent(new CustomEvent(eventName, Object.assign({ detail: data }, opts)))
}

function loadScript (url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.onload = () => resolve(script)
    script.onError = () => reject(script)
    document.head.appendChild(script)
  })
}

function createStyleLink (url, root) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.onload = () => resolve(link)
    link.onError = () => reject(link)
    link.href = url;
    (root || document.head).appendChild(link)
  })
}

function createStyleElement (styles, root) {
  const element = document.createElement('style')
  element.textContent = styles;
  (root || document.head).appendChild(element)
  return element
}

function getPromise (name, cb) {
  return WebComponent.Promises[name] || (WebComponent.Promises[name] = typeof cb === 'function' ? new Promise(res => cb(res)) : cb)
}

function getViewerLoadObject (e, defOpts) {
  const loadObj = eleAttrToObject(e, ['url', 'urn', 'name', 'view-name', 'view', 'type', 'guid'])
  loadObj.name = loadObj.name || generateRandomString()
  return WebComponent.LoadOptions[loadObj.name] = Object.assign(loadObj, defOpts, parseObjectFromContent((e.querySelector('options') || {}).textContent))
}

function getJSONorDesendent (val) {
  { try { return JSON.parse(val) } catch (err) { return getDescendantProp(window, val) } }
}

function eleAttrToObject (e, attrs) {
  return attrs.reduce((o, attr) => { const key = typeof attr === 'object' ? Object.keys(attr)[0] : attr; const val = typeof attr === 'object' ? attr[key](e.getAttribute(key)) : e.getAttribute(attr); return Object.assign(o, { [key]: val }) }, {})
}

function generateRandomEleId () {
  return generateRandomString(val => document.getElementById(val))
}

function getDescendantProp (obj, desc) {
  if (desc) {
    const arr = desc.split('.')
    while (arr.length && (obj = obj[arr.shift()]));
    return obj
  }
}

function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

export { isFunction, getDescendantProp, generateRandomEleId, getJSONorDesendent, getViewerLoadObject, createStyleElement, createStyleLink, createViewerStyle, loadScript, triggerEvent, appendIfNaN, parseObjectFromContent, isValidURL, getPromise, throwException }
