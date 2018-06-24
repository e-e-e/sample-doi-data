const fs = require('fs')
const request = require('request-promise-native')
const PromiseQueue = require('a-promise-queue')

const config = require('./configuration')

try {
  fs.mkdirSync(config.SAMPLE_DIR)
} catch (e) { }

const writeStream = fs.createWriteStream(config.DOI_LIST)

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getSampleFromYear (year) {
  console.log('getting', year)
  return request({
    url: `${config.CROSSREF_API_URL}/works?sample=100&select=DOI&filter=from-created-date:${year}-01-01,until-created-date:${year}-12-31`,
    headers: config.DEFAULT_HEADERS,
    json: true
  }).then((res) => {
    res.message.items.forEach((item) => {
      if (item && item.DOI) {
        writeStream.write(item.DOI + '\n')
      }
    })
  })
}

function onEnd () {
  writeStream.end()
}

const queue = new PromiseQueue(onEnd)
for (let i = 2; i <= 18; i++) {
  const year = i < 10 ? `200${i}` : `20${i}`
  queue.add(() => getSampleFromYear(year).then(() => delay(500)))
}
