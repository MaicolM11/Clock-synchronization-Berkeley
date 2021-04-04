const axios = require('axios')
const logger = require('./logger')

global.clock = new Date()

setInterval(() => clock.setMilliseconds(clock.getMilliseconds() + 1000), 1000)
setInterval(() => berkeley(), 60000)

function berkeley() {
    let allInstances = [], urls = getUrls(),
        path = `/berkeley/difference?hour=${clock.getHours()}&minutes=${clock.getMinutes()}&seconds=${clock.getSeconds()}`
    if (urls.length == 0) return
    urls.forEach(x => { allInstances.push(axios.get(x + path)) });
    axios.all(allInstances)
        .then(responseArr => {
            let avg = 0, i = 0, allInstances = [];
            responseArr.forEach(x => avg += x.data.difference)
            avg /= (responseArr.length + 1)
            urls.forEach(x => allInstances.push(
                axios.post(x + '/berkeley/time', {
                    adjustment: avg + responseArr[i++].data.difference
                })))
            axios.all(allInstances).catch((err) => { throw err })
            clock.setMilliseconds(clock.getMilliseconds() + avg * 1000)
            doLogs(urls, responseArr, avg);
        }).catch((err) => logger.error('[BERKELEY-ERROR] The algorithm has failed. ' + err.toString()));
}

function doLogs(urls, responseArr, avg) {
    logger.info(`[BERKELEY-INIT] The time was adjusted to ${urls.length} clients`)
    for (let i = 0; i < urls.length; i++) {
        logger.info(`[BERKELEY-SERVER] ${urls[i]} ${responseArr[i].data.difference}`)
    }
    logger.info(`[BERKELEY-FINISH] The algorithm has finished successfully with AVG ${avg}`)
}

function getUrls() {
    var urls = []
    for (var [key, value] of Object.entries(servers)) {
        if (value.length > 0) urls.push(key)
    }
    return urls
}