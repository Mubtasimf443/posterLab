/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { model, models, Schema, Types } from "mongoose";

export interface IGenerationLog {
    posterId: Types.ObjectId;
    geminiPromptUsed: string;
    tokensUsed: number;
    latencyMs: number;
    success: boolean;
}


const generationLogSchema = new Schema<IGenerationLog>({
    posterId: {
        type: Schema.Types.ObjectId,
        ref: "Poster",
        required: true,
        index: true,
    },
    geminiPromptUsed: {
        type: String,
        required: true,
    },
    tokensUsed: {
        type: Number,
        default: 0,
        min: 0,
    },
    latencyMs: {
        type: Number,
        required: true,
        min: 0,
    },
    success: {
        type: Boolean,
        required: true,
        index: true,
    },
});

const GenerationLogs = model<IGenerationLog>('GenerationLogs', generationLogSchema);

export default GenerationLogs;