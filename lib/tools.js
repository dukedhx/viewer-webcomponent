
function generateRandomString (cb) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
  return cb && cb(text) ? generateRandomString(cb) : text
}

export { generateRandomString }
