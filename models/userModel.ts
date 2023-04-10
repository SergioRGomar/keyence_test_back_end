import { Schema, model } from "mongoose"


const userSchema:any = new Schema({
        user_id:{
            type: Number,
            required:true,
            trim:true
        },
        user_name:{
            type:String,
            required:true,
            trim:true
        },
        date:{
            type:Object,
            required:true,
            trim:true
        },
        punch_in:{
            type:Object,
            required:true,
            trim:true
        },
        punch_out:{
            type:Object,
            required:true,
            trim:true
        },
    },{
        versionKey:false
    }
);

export default model('users',userSchema);