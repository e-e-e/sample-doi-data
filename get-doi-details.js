const fs = require('fs')
const path = require('path')
const request = require('request-promise-native')
const readline = require('readline')

const PromiseQueue = require('a-promise-queue')

const config = require('./configuration')
const TYPE = 'csl.json'

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const type = {
  ttl: 'text/turtle',
  'csl.json': 'application/vnd.citationstyles.csl+json'
}
const TYPE_DIR = path.join(config.SAMPLE_DIR, `/${TYPE}`)
try {
  fs.mkdirSync(TYPE_DIR)
} catch (e) { }

function getDetailFromDOI (doi) {
  console.log('getting', doi)
  return request({
    url: `${config.DOI_URL}/${doi}`,
    headers: {
      Accept: type[TYPE]
    }
  }).then((res) => {
    console.log(res)
    const filename = path.join(TYPE_DIR, `/${doi.replace(/\//g, '_')}.${TYPE}`)
    fs.writeFileSync(filename, res)
  })
}
const queue = new PromiseQueue()
const rl = readline.createInterface({
  input: fs.createReadStream(config.DOI_LIST),
  crlfDelay: Infinity
})

rl.on('line', (doi) => {
  if (!doi) return
  queue.add(() => getDetailFromDOI(doi).then(() => delay(500)))
})
