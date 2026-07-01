import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({

    subject:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true
    },

    file:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

export default mongoose.model("Note",noteSchema);