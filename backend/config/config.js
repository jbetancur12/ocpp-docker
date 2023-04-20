const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB,
    NODE_ENV,
    HOST_PORT
  } = process.env;

console.log(HOST_PORT)
const config = {
  env: NODE_ENV || 'development',
  port: HOST_PORT,
  jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',
  mongoUri:
    // 'mongodb+srv://mongo:mongo@cluster0.iwcxlbe.mongodb.net?retryWrites=true&w=majorityrs' ||
    //process.env.MONGODB_URI ||
    //process.env.MONGO_HOST ||
    `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin` 
};

export default config;
