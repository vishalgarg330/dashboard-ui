require('dotenv').config();
exports.server = {
    SERVER_PORT                             : Number(process.env.PORT) || 3000,
    MODE                                    : 'prod',
    MONGO_URL                               : 'mongodb://localhost:27017/crud_backend',
    MONGO_TEST_URL                          : 'mongodb://localhost:27017/crud_backend',
    SESSION_SECRET                          : process.env.REDIS_PASSWORD || 'zhdbcshvchdvhdvfd',
    REDIS_PASSWORD                          : process.env.REDIS_PASSWORD || '',
    REDIS_HOST                              : process.env.REDIS_HOST || 'localhost',
    REDIS_PORT                              : Number(process.env.REDIS_PORT) || 6379,
    ORIGIN_SECURE                           : Number(process.env.ORIGIN_SECURE) || true,
    REDIS_TTL                               : Number(process.env.REDIS_TTL) || 260,
    ADMIN_TOKEN_PRIVATE_KEY                 : 'sdbchjsbvhdfv',
    RABBITMQ_HOST                           : 'localhost',
    RABBITMQ_PORT                           : 5672,
    RABBITMQ_USER                           : 'jsdchvs',
    RABBITMQ_PASSWORD                       : 'sdjbshj',
    JWT_PRIVATE_KEY                         : "sndcvdhgf2736634rjhhbh"
}
