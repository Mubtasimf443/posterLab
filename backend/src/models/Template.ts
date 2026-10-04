/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { model, Schema } from "mongoose";

interface ITemplate{
    title : string ;
    occasionType : string, 
    thumbnailUrl: string, 
    layoutConfig : {
        photoSlots : string[];
        textSlots : string[];
        colorScheme :{
            primary: string;
            secondary : string;
            accent : string;
        }
    },
    createdAt : Date
}

const templateSchema= new Schema<ITemplate>({
    title : {
        type : String,
        required: true,
    },
    occasionType : {
        type : String,
        required: true,
    },
    thumbnailUrl : {
        type : String,
        required : true
    },
    layoutConfig :{
        photoSlots : [{
            type : String,
            required : true
        }],
        textSlots : [{
            type: String,
            required : true
        }],
        colorScheme: {
            primary: String,
            secondary: String,
            accent: String
        }
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
})

const Templates= model<ITemplate>('Templates', templateSchema);

export default Templates;