const {createLogger,format,transports, error} = require('winston');

const customFormat = format.printf(({timestamp,level,message,...meta}) => {
    // const metaOutput = Object.keys(meta).length ? JSON.stringify(meta) : '';
    const metaOutput = JSON.stringify(meta);
    
    return `${timestamp} | ${level}: ${message} \t ${metaOutput}`;
});

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({format: 'DD-MM-YY HH:mm:ss'}),
        // format.colorize(), only for consoles
        customFormat,
        format.errors({stack: true})
    ) ,
    transports: [
        // new transports.Console()
        new transports.File({filename: "./logger/system.log"})
    ]
});

module.exports = logger;
