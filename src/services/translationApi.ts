import axios from "axios";

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
        const res = await translationApi.post("/translate", {
            "in" : text,
            "lang": `${from}-${to}`
        })
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}