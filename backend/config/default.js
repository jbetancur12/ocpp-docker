const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB,
    NODE_ENV,
    HOST_PORT,
    JWT_SECRET
  } = process.env;
 console.log(JWT_SECRET)

module.exports = {
  env: NODE_ENV || 'development',
  port: HOST_PORT,
  accessTokenExpiresIn: 15,
  jwtSecret: JWT_SECRET || 'YOUR_secret_key',
//   accessTokenPrivateKey: ACCESS_TOKEN_PRIVATE_KEY || 'YOUR_secret_key',
//   accessTokenPublicKey: ACCESS_TOKEN_PUBLIC_KEY || 'YOUR_secret_key',
  mongoUri: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin` 
};




