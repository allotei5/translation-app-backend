import express from "express";
import { isAuthenticated } from "../middlewares";
import { createTranscriptFxn } from "../controllers/transcriptController";
import { getUserTranscripts } from "../controllers/userController";

export default (router: express.Router) => {
    router.post('/transcript', isAuthenticated, createTranscriptFxn)
    router.get('/transcripts', isAuthenticated, getUserTranscripts)
}