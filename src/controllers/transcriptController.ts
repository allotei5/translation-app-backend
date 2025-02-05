import { getUserById } from "../db/user";
import { createTranscript, getTranscriptById } from "../db/transcript";
import express from "express"
import Joi from "joi";
import { get } from 'lodash'
import { translateText } from "../services/translationApi";
import { storeTranslation } from "../db/translation";

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

const languageCodes = {
    English: "en",
    Ga: "gaa",
    Twi: "tw",
    Ewe: "ee",
  } as const;

type LanguageCode = keyof typeof languageLabels;
type LanguageCodesType = keyof typeof languageCodes;

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

export const getTranscriptByIdFxn = async (req: express.Request, res: express.Response) => {
    try {
        // get user id from request
        // get transcript id from the request
        // check if the transcript belongs to the user
        // return the transcript
        // else return 403
        const currentUserId = get(req, 'identity._id') as string;
        const { id } = req.params;
        const transcript = await getTranscriptById(id).populate('translations');
        if (!transcript) {
            return res.sendStatus(404);
        }
        if (transcript.user.toString() != currentUserId) {
            return res.sendStatus(403);
        }
        return res.status(200).json(transcript);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

const TranslationSchema = Joi.object({
    originalText: Joi.string().required(),
    originalLanguage: Joi.string().required(),
    translatedLanguage: Joi.string().required(),
})

export const translateTextFxn = async (req: express.Request, res: express.Response) => {

    try {
        // get transcript id from the request
        // get text, from and to from the request
        // request for translation from the translation api
        // save the translation to the transcript
        // return the translation object

        const { id } = req.params;
        const transcript = await getTranscriptById(id);
        if (!transcript) {
            return res.sendStatus(404);
        }

        const { error, value } = TranslationSchema.validate(req.body);
        if (error) {
            return res.status(422).json({
                message: 'Validation error',
                details: error.details,
            });
        }

        const { originalText, originalLanguage, translatedLanguage } = req.body as { originalText: string; originalLanguage: LanguageCodesType; translatedLanguage: LanguageCodesType };

        const translation = await translateText(originalText, languageCodes[originalLanguage], languageCodes[translatedLanguage]);

        const storedTranslation = await storeTranslation({
            transcript: transcript._id,
            originalText,
            translatedText: translation,
            originalLanguage: originalLanguage,
            translatedLanguage: translatedLanguage,
        })

        transcript.translations.push(storedTranslation._id);

        await transcript.save();

        return res.status(200).json(storedTranslation);

        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}