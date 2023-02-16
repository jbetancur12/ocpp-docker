const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3030,
  jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',
  mongoUri:
    // 'mongodb+srv://mongo:mongo@cluster0.iwcxlbe.mongodb.net?retryWrites=true&w=majorityrs' ||
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' +
      (process.env.IP || 'localhost') +
      ':' +
      (process.env.MONGO_PORT || '27017') +
      '/ocpp',
};

export default config;
