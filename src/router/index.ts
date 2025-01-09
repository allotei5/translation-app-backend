
import express from 'express';
import multer from 'multer';
import authentication from './authentication';
import userRouter from './userRouter';
import transcriptRouter from './transcriptRouter';

const router = express.Router();

export default(): express.Router => {
  authentication(router);
  userRouter(router);
  transcriptRouter(router)
  return router;  
}
