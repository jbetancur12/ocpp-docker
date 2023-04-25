import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';


import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
// import chargerPointsRoutes from './routes/chargerPoint.routes';
import costRoutes from './routes/cost.routes';
// import transactionsRoutes from './routes/transaction.routes';
import dashboardRoutes from './routes/dashboard.routes';
import locationsRoutes from './routes/location.routes';
import companiesRoutes from './routes/company.routes';

import sse from './sse';
import redisClient from './helpers/connectRedis';

const app = express();
/*... configure express ... */


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(compress());
app.use(helmet());
app.use(cors());
app.use(sse);


app.use('/', userRoutes);
app.use('/api/auth', authRoutes);
// app.use('/', chargerPointsRoutes);
app.use('/', costRoutes);
// app.use('/', transactionsRoutes);
app.use('/',dashboardRoutes)
app.use('/',locationsRoutes)
app.use('/',companiesRoutes)

// Testing
app.get('/api/healthChecker', async (req, res) => {
    const message = await redisClient.get('try');
    res.status(200).json({
      status: 'success',
      message
    });
  });

  // UnKnown Routes
app.all('*', (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
  });


app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

export default app;
