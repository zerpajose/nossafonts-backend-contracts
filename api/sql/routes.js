import express from 'express';
import { register } from './controllers/register.js';
import { get } from './controllers/get.js';
import { search } from './controllers/search.js';

const router = express.Router();

router.post('/', register);
router.get('/', get);
router.get('/:s', search);

export default router;
