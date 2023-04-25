import express from 'express';
import { loginHandler, registerHandler } from '../controllers/auth.controller';

const router = express.Router();

// Register user route
router.post('/register', registerHandler);

// Login user route
router.post('/login', loginHandler);

export default router;