import axios from "axios";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const translationApi = axios.create({
  baseURL: process.env.TRANSLATION_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": process.env.OPIM_SUBSCRIPTION_KEY
  },
});

export const translateText = async (text: string, from: string, to: string) => {
    try {
        const res = await translationApi.post("/v1/translate", {
            "in" : text,
            "lang": `${from}-${to}`
        })
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const textToSpeech = async (text: string, language: string) : Promise<string|null> => {
  try {
    /* This code snippet is making a POST request to the translation API endpoint "/tts/v1/tts" with
    the provided text and language parameters. Additionally, it specifies the responseType as
    "arraybuffer" in the request configuration. This means that the response from the API will be
    treated as an array buffer, which is a generic, fixed-length binary data buffer. */
    const res = await translationApi.post("/tts/v1/tts", {
      text,
      language
    }, {
      responseType: "arraybuffer"
    });

    /* `const audioBuffer = Buffer.from(res.data, 'binary');` is creating a buffer from the binary data
    received in the response from the translation API. This buffer will contain the audio data in
    binary format. */
    const audioBuffer = Buffer.from(res.data, 'binary');
    const fileName = crypto.randomBytes(16).toString('hex') + ".mp3";
    // const audioDir = path.join(__dirname, 'public', 'audio');

    const audioDir = path.join(process.cwd(), 'public', 'audio');
    fs.mkdirSync(audioDir, { recursive: true });
    const filePath = path.join(audioDir, fileName);

    fs.writeFile(filePath, audioBuffer, (err) => {
      if (err) {
        console.error('Error saving the audio file:', err);
        throw err;
      }
    })

    return fileName;
  } catch (error) {
    console.log(error);
    return null;
    throw error;
  }
}