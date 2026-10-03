/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { model, Schema, Types } from "mongoose";

interface IFormData {
    name:string;
    designation: string; 
    party: string;
    district : string;
}
export interface IPoster {
    userId: Types.ObjectId;
    templateId: Types.ObjectId;
    formData : IFormData;
    uploadedPhotoUrls : string[];
    generatedImagesUrl : string[];
    status : 'draft' | 'generating' | 'completed' | 'failed';
    createdAt : Date
}

const PosterSchema = new Schema<IPoster>({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    templateId : {
        type : Schema.Types.ObjectId,
        ref : 'Templates',
        required : true
    },
    formData : {
        name : {
            type : String,
            required : true
        },
        designation : {
            type : String,
            required : true
        },
        party : {
            type : String,
            required : true
        },
        district : {
            type : String,
            required : true
        },
    },
    uploadedPhotoUrls: [{ type: String, required: true }],
    generatedImagesUrl: [{ type: String, required: true }],
    status : {
        type :String,
        enum: ['draft', 'generating', 'completed', 'failed']
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
});


const Posters = model<IPoster>('Posters', PosterSchema);

export default Posters;