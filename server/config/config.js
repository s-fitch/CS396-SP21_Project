const env = process.env;

const dbProdConfig = {
    database: `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_NAME_PRODUCTION}?retryWrites=true&w=majority`,
    host: "http://localhost",
    mongoConfig: {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};
const dbDevConfig = {
    database: `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_NAME_DEVELOPMENT}?retryWrites=true&w=majority`,
    host: "http://localhost",
    mongoConfig: {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};
module.exports = {
    development: dbDevConfig,
    production: dbProdConfig
};