import express from 'express';
import multer from 'multer';
import { upload } from './controllers/upload.js';
import { get } from './controllers/get.js';

const router = express.Router();

const storage = multer.memoryStorage();
const multerInstance = multer({ storage: storage });

router.post('/', multerInstance.single('file'), upload);
router.get('/', get);

export default router;
