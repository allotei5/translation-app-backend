import express from "express";
import { isAuthenticated } from "../middlewares";
import { createTranscriptFxn, getTranscriptByIdFxn, handleTTS, translateTextFxn } from "../controllers/transcriptController";
import { getUserTranscripts } from "../controllers/userController";

export default (router: express.Router) => {
    router.post('/transcript', isAuthenticated, createTranscriptFxn)
    router.get('/transcripts', isAuthenticated, getUserTranscripts)
    router.get('/transcript/:id', isAuthenticated, getTranscriptByIdFxn)
    router.post('/transcript/:id/translate', isAuthenticated, translateTextFxn)
    router.post('/tts', handleTTS);
}