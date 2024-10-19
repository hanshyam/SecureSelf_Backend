import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Compulsory"],
    },
    email: {
      type: String,
      required: [true, "Email is compulsory"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    address: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    
    userLoginsNumber:[{
      type:Date,
    }],

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailOtpExpires: Date,
    emailOTP : Number,
    isEmailVarified : {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware for hashing password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method for comparing entered password with the hashed password in the database
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export default userModel;
