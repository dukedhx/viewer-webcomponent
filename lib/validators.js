import { isFunction, throwException, isValidURL } from './utils'

class validator {
  constructor (condition, failCB, successCB) {
    this.validate = (val, aFailCB, aSuccessCB) => (isFunction(condition) ? condition(val) : condition) && (aSuccessCB || successCB || (val => val))(val) || (isFunction(aFailCB = aFailCB || failCB) ? aFailCB(val) : throwException(aFailCB))
  }
}

export default { isBase64: new validator(val => { try { atob(val); return true } catch (err) {} return false }, val => btoa(validators.isTrimmedString(val))), isTrimmedString: new validator(val => typeof val === 'string', null, val => val.trim()), isNotSet: new validator(val => !val), isFullURN: new validator(val => val = validators.isTrimmedString(val), 'Not a string', val => 'urn:' + validators.isBase64.validate(val.indexOf('urn:') == '0' ? val.substring(4) : val)), isFunction: new validator(isFunction), isObject: new validator(val => typeof val === 'object'), isUrl: new validator(isValidURL, 'Not a valid URL'), isArray: new validator(val => val instanceof Array) }
