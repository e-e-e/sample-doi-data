const path = require('path')
const headers = {}
try {
  const config = require('./config')
  if (config.email) {
    headers['User-Agent'] = `doi-samples/1.0 (mailto:${config.email})`
  }
} catch (e) { }
const dir = path.join(process.cwd(), '/samples')
const doiList = path.join(dir, '/doi-list.txt')

module.exports = {
  DEFAULT_HEADERS: headers,
  SAMPLE_DIR: dir,
  DOI_LIST: doiList,
  CROSSREF_API_URL: 'https://api.crossref.org',
  DOI_URL: 'https://doi.org'
}
