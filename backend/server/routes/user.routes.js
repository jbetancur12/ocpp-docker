import express from 'express';
import {
    getAllUsersHandler,
    getMeHandler,
  } from '../controllers/user.controller';
  import { deserializeUser } from '../middleware/deserializeUser';
  import { requireUser } from '../middleware/requireUser';
  import { restrictTo } from '../middleware/restrictTo';

const router = express.Router();

router.route('/api/users').get(getAllUsersHandler)

router
  .route('/api/users/me')
  .get(getMeHandler)

export default router;
