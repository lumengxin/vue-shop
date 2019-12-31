let url = {
  baseUrl: 'http://124.34.32.42:8888/'
}

let urlDev = {
  baseUrl: 'http://127.0.0.1:8888/'
}

var config
if (window.location.href.indexOf('http://124.34.32.42:8888/') > -1) {
  config = url
} else {
  config = urlDev
}

export default config
