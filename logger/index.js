const {createLogger,format,transports} = require('winston');
const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(({timestamp,level,message,...meta}) => {
            const metaOutput = Object.keys(meta).length ? JSON.stringify(meta) : '';
            // ${JSON.stringify(meta)}
            // return `
            // ${timestamp} ${level}: ${message} ${JSON.stringify(meta)}`;
            return `
            ${timestamp} ${level}: ${message} ${metaOutput}`;
        })
    ) ,
    transports: [
        // new (winston.transport.File)({filename: 'system.log'})
        new transports.Console()
    ]
});

logger.info('Data to log.', {'xyz': 123, 'id': 42});
logger.debug('Debugging info here');