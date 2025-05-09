import express from 'express';
import { nonce } from './controllers/nonce.js';
import { verify } from './controllers/verify.js';

const router = express.Router();

router.get('/nonce', nonce);
router.post('/verify', verify);

export default router;
