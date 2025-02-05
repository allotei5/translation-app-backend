import mongoose from "mongoose";

interface Transcript extends mongoose.Document {
  firstLanguage: string;
  firstLanguageCode: string;
  secondLanguage: string;
  secondLanguageCode: string;
  createdAt?: Date;
  updatedAt?: Date;
  user: mongoose.Schema.Types.ObjectId | string;
  translations: mongoose.Types.ObjectId[];
}

type TranscriptInput = Omit<Transcript, "_id" | "createdAt" | "updatedAt">;

const TranscriptSchema = new mongoose.Schema<Transcript>(
  {
    firstLanguage: { type: String, required: true },
    firstLanguageCode: { type: String, required: true },
    secondLanguageCode: { type: String, required: true },
    secondLanguage: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    translations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Translation" }],
  },
  { timestamps: true }
);

export const TranscriptModel = mongoose.model("Transcript", TranscriptSchema);

export const createTranscript = (values: Record<string, any>) =>
  new TranscriptModel(values)
    .save()
    .then((transcript) => transcript.toObject() as Transcript & { _id: mongoose.Types.ObjectId });


export const getTranscriptById = (id: string) => TranscriptModel.findById(id);
// export const getUserTranscripts = (id: string) => 