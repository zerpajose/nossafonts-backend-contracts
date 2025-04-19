import express from 'express';
import fontsApi from './fonts/routes.js';
import sqlApi from './sql/routes.js';

const router = express.Router();

router.use('/fonts', fontsApi);
router.use('/sql', sqlApi);

export default router;