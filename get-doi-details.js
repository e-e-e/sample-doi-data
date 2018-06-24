const fs = require('fs')
const path = require('path')
const request = require('request-promise-native')
const readline = require('readline')

const PromiseQueue = require('a-promise-queue')

const config = require('./configuration')

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const TURTLE_DIR = path.join(config.SAMPLE_DIR, `/ttl`)
try {
  fs.mkdirSync(TURTLE_DIR)
} catch (e) { }

function getDetailFromDOI (doi) {
  console.log('getting', doi)
  return request({
    url: `${config.DOI_URL}/${doi}`,
    headers: {
      Accept: 'text/turtle'
    }
  }).then((res) => {
    console.log(res)
    const filename = path.join(TURTLE_DIR, `/${doi.replace(/\//g, '_')}.ttl`)
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
