import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';


import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import chargerPointsRoutes from './routes/chargerPoint.routes';
import costRoutes from './routes/cost.routes';
import transactionsRoutes from './routes/transaction.routes';
import dashboardRoutes from './routes/dashboard.routes';

import sse from './sse';

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
app.use('/', authRoutes);
app.use('/', chargerPointsRoutes);
app.use('/', costRoutes);
app.use('/', transactionsRoutes);
app.use('/',dashboardRoutes)


app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

export default app;
