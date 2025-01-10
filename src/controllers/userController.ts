import express from "express";
import { getUserById, getUserBySessionToken } from "../db/user";
import { get } from "lodash";


export const getUserBySessionTokenFxn = async (req: express.Request, res: express.Response) => {
    try {
        const sessionToken = req.cookies["translation-app-backend"];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(403);
        }

        return res.status(200).json(existingUser).end();
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}

export const getUserTranscripts = async (req: express.Request, res: express.Response) => {
    try {
        const currentUserId = get(req, 'identity._id') as string;
        const user = await getUserById(currentUserId).populate({
            path: "transcripts",
            options: { sort: { updatedAt: -1 } }
        });
        return res.status(200).json(user.transcripts).end()
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}