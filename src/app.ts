import express from 'express';
import cors from 'cors';
import api from './api/routes.js';

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', api);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
