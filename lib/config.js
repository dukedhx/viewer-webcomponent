import { generateRandomString } from './tools'
const startPromisePrefix = 'start'
const viewerCreatedEvent = generateRandomString()
const viewerCSSURLBase = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/style.min.css?v=v'
const viewerJSURLBase = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.min.js?v=v'
const defaultModelLoadOptions = { keepCurrentModels: true }
const defaultViewerVersion = '7'
export { defaultModelLoadOptions, defaultViewerVersion, startPromisePrefix, viewerCreatedEvent, viewerCSSURLBase, viewerJSURLBase }
