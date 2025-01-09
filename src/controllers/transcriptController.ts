import { getUserById } from "../db/user";
import { createTranscript } from "../db/transcript";
import express from "express"
import Joi from "joi";
import { get } from 'lodash'

const transcriptSchema = Joi.object({
    firstLanguage: Joi.string().required().messages({
        "any.required": `First language is required`,
        "string.base": `First language must be of type string`
    }),
    secondLanguage: Joi.string().required().messages({
        "any.required": `Second language is required`,
        "string.base": `Second language must be of type string`
    }),
})

const languageLabels = {
    en: "English",
    gaa: "Ga",
    tw: "Twi",
    ee: "Ewe",
  } as const;
  
type LanguageCode = keyof typeof languageLabels;

export const createTranscriptFxn = async (req: express.Request, res: express.Response) => {
    try {
        const { error, value } = transcriptSchema.validate(req.body);
        if (error) {
            return res.status(422).json({
              message: 'Validation error',
              details: error.details,
            });
        }
        const currentUserId = get(req, 'identity._id') as string;
        const { firstLanguage, secondLanguage } = req.body as { firstLanguage: LanguageCode; secondLanguage: LanguageCode };

        const transcript = await createTranscript({
            firstLanguage: languageLabels[firstLanguage],
            secondLanguage: languageLabels[secondLanguage],
            firstLanguageCode: firstLanguage,
            secondLanguageCode: secondLanguage,
            user: currentUserId,
        });

        const user = await getUserById(currentUserId)
        user.transcripts.push(transcript._id)
        await user.save()
        return res.status(201).json(transcript)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}