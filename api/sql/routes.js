import express from 'express';
import { register } from './controllers/register';
import { get } from './controllers/get';
import { search } from './controllers/search';

const router = express.Router();

router.post('/', register);
router.get('/', get);
router.get('/:s', search);

export default router;
