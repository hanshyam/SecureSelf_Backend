import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    category:{
        type:String,
        required:true
    },
    discription:{
        type:String,
    },
    imageUrl:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
  },
  {
    timestamps: true,
  }
);

const documentModel = mongoose.models.documents || mongoose.model("documents", documentSchema);

export default documentModel;
