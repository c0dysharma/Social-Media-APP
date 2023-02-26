import express from 'express';
import morgan from 'morgan';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import postRouter from './routes/postRouter.js';
import statsRouter from './routes/statsRouter.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/stats', statsRouter);

// if no router handled the request its a 404 error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server.`, 404));
});

// catch erer
app.use(globalErrorHandler);
export default app;
