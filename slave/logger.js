const path = require('path')

const { createLogger, format, transports } = require('winston')


var logger = createLogger({
    transports: [
        new transports.File({
            filename: path.join(__dirname, "logs/information.log"),
            format: format.combine(format.simple(), format.printf(info => `[${info.level.toUpperCase()}]  ${global.clock.toLocaleString()} : ${info.message}`))
        })
    ]
})

module.exports= logger;