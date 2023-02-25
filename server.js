import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import app from './app.js';

dotenv.config();
mongoose.set('strictQuery', true);

const db = process.env.DB_REMOTE_URL;
mongoose.connect(db).then(() => {
  console.log('Connection to DB successful.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running in: ${process.env.NODE_ENV} mode`);
  console.log(`Server is runnig on port: ${port}`);
});
