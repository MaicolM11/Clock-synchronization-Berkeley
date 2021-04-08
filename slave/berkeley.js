const route = require('express').Router()
const logger = require('./logger');

global.clock = new Date()

setInterval(() => {
    clock.setMilliseconds(clock.getMilliseconds() + 1000)
}, 1000)

var getHourSeconds = (date) => (parseInt(date.hour) * 3600) + (parseInt(date.minutes) * 60) + parseInt(date.seconds);

// obtener diferencia con la hora que llega por parametro
// http://localhost:4001/berkeley/difference?hour=8&minutes=30&seconds=10
route.get('/difference', (req, res) => {
    let myDate = { hour: clock.getHours(), minutes: clock.getMinutes(), seconds: clock.getSeconds() }
    let diff = getHourSeconds(req.query) - getHourSeconds(myDate)
    res.send({ difference: diff })
})

// edit time from server
route.post('/time', (req, res) => {

    let before_clock = new Date(clock.getTime())
    clock.setTime(clock.getTime() + (req.body.adjustment  * 1000))
    logger.info(`[COORDINATOR] Berkeley Coordinator has changed the time from ${before_clock.toLocaleTimeString()} to ${clock.toLocaleTimeString()}. Adjustment: ${req.body.adjustment} seg`)
    res.sendStatus(200)
})

module.exports = route