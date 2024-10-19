import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    bgcolor:{
        type:String,
        default:"#fff"
    },
    category:{
        type:String,
        default:"normal"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},
{
    timestamp:true
})

const noteModel = mongoose.models.notes || mongoose.model("notes",noteSchema);

export default noteModel;