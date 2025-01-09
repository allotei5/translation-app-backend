import express from 'express';
import { getUserBySessionTokenFxn } from '../controllers/userController';

export default (router: express.Router) => {
    router.get('/user', getUserBySessionTokenFxn);
}