import mongoose from "mongoose";

interface Translation extends mongoose.Document {
  transcript: mongoose.Schema.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
  originalText: string;
  translatedText: string;
  originalLanguage: string;
  translatedLanguage: string;
  audioUrl?: string;
}

const TranslationSchema = new mongoose.Schema<Translation>(
  {
    transcript: { type: mongoose.Schema.Types.ObjectId, ref: "Transcript" },
    originalText: { type: String, required: true },
    translatedText: { type: String, required: true },
    originalLanguage: { type: String, required: true },
    translatedLanguage: { type: String, required: true },
    audioUrl: { type: String },
  },
  { timestamps: true }
);

export const TranslationModel = mongoose.model(
  "Translation",
  TranslationSchema
);
export const storeTranslation = (values: Record<string, any>) =>
  new TranslationModel(values)
    .save()
    .then(
      (translation) =>
        translation.toObject() as Translation & { _id: mongoose.Types.ObjectId }
    );


