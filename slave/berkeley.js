const route = require('express').Router()

global.clock = new Date('2021-01-01T00:00:00.00')

setInterval(() => {
    clock.setMilliseconds(clock.getMilliseconds() + 1000)
    console.log(clock)
}, 1000)

var getHourSeconds = (date) => (parseInt(date.hour) * 3600) + (parseInt(date.minutes) * 60) + parseInt(date.seconds);

// obtener diferencia con la hora que llega por parametro
// http://localhost:3000/difference?hour=8&minutes=30&seconds=10
route.get('/difference', (req, res) => {
    let myDate = { hour: clock.getHours(), minutes: clock.getMinutes(), seconds: clock.getSeconds() }
    let diff = getHourSeconds(req.query) - getHourSeconds(myDate)
    res.send({ difference: diff })
})

// edit time from server
route.post('/time', (req, res) => {
    clock.setTime(clock.getTime() + (req.body.seconds * 1000))
    res.sendStatus(200)
})

module.exports = route