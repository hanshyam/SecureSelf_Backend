import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import GenerateJwtToken from "../config/generateJwtToken.js";
import GenerateRefreshToken from "../config/generateRefreshToken.js";
// validate here your mongo id from "../utils/validateMongoId.js";
import sendEmail from "./emailController.js";
import bcrypt from "bcrypt";

const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are compulsory");
  }

  const findUser = await userModel.findOne({ email });
  if (findUser) {
    res.status(409);
    throw new Error("User already exists!");
  }

  const emailOTP = Math.floor(100000 + Math.random() * 900000);
  const emailOtpExpires = Date.now() + 10 * 60 * 1000;

  const newUser = await userModel.create({
    name,
    email,
    password,
    emailOTP,
    emailOtpExpires,
  });
  
  res.status(201).json({
    message: "User registered successfully.",
    userId: newUser._id,
  });
  
  // send otp
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  user.emailOTP = otp;
  user.save();

  const emailData = {
    to: user.email,
    subject: "Email Verification OTP",
    text: `Hi ${user.name}, your OTP for email verification is ${otp}.`,
    html: `<p>Hi ${user.name},</p><p>Your OTP for email verification is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
  };
  try {
    // Await the sendEmail function
    await sendEmail(emailData);
  } catch (error) {
    // Handle email sending error
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send OTP email." });
    return; // Exit early to prevent further responses
  }

  res.status(201).json({
    message: "Otp is send successfully",
  });

});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await userModel.findOne({ email: email });
  
  if(!user){
    res.status(401);
    return res.json({message:"User Does Not exist"});
  }
  if (otp !== user.emailOTP.toString()) {
    res.status(400);
   return res.json({ success: false, message: "Otp is incorrect" });
  }
  user.emailOTP = "";
  user.emailOtpExpires = "";
  user.isEmailVarified = true;
  user.save();
  res.json({ user: user._id, message: "Otp verify successfully" });
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  user.emailOTP = otp;
  user.save();

  const emailData = {
    to: user.email,
    subject: "Email Verification OTP",
    text: `Hi ${user.name}, your OTP for email verification is ${otp}.`,
    html: `<p>Hi ${user.name},</p><p>Your OTP for email verification is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
  };
  try {
    // Await the sendEmail function
    await sendEmail(emailData);
  } catch (error) {
    // Handle email sending error
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send OTP email." });
    return; // Exit early to prevent further responses
  }

  res.status(201).json({
    message: "Otp is send successfully",
  });
});

// login
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await userModel.findOne({ email });

  // If user does not exist
  if (!user) {
    return res
      .status(404)
      .json({ message: "User is not registered", success: false });
  }

  // If user is not verified
  if (!user.isEmailVarified) {
    await userModel.findOneAndDelete({ email: email });
    return res
      .status(404)
      .json({ message: "User is not verified", success: false });
  }

  // Check password validity
  if (user && (await bcrypt.compare(password, user.password))) {
    const refreshToken = GenerateRefreshToken(user._id);

    await userModel.findByIdAndUpdate(
      user._id,
      { refreshToken: refreshToken },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset the time part to only compare the date

    // Check if a date with the same day already exists in the array
    const dateExists = user.userLoginsNumber.some(
      (loginDate) =>
        loginDate.toISOString().split("T")[0] ===
        today.toISOString().split("T")[0]
    );

    if (!dateExists) {
      user.userLoginsNumber.push(today);
      await user.save();
      console.log("New login date added.");
    } else {
      console.log("Login date already exists for today.");
    }

    return res.status(200).json({
      message: "User is login sucessfully",
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        token: GenerateJwtToken(user),
      },
    });
  } else {
    // Invalid credentials
    return res.status(401).json({
      message: "Either email or password is incorrect",
      success: false,
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const id = req.params.id;
  // validate here your mongo id(id);

  const user = await userModel.findById(id);

  user.password = password;
  user.save();

  res.json({ message: "Password changed successfully" });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("No refresh token is available");
  }
  const refreshToken = cookie.refreshToken;
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await userModel.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

const getUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  // validate here your mongo id(_id);
  const user = await userModel.findById(_id);
  if (!user) {
    res.json({ message: "user doesnot exist" });
  }
  res.json({
    name: user.name,
    email: user.email,
    logins: user.userLoginsNumber
  });
});

const updateUser = asyncHandler(async (req,res)=>{
   const {_id} = req.user;
   // validate here your mongo id(_id);

   const updatedUser = await userModel.findByIdAndUpdate(_id,req.body,{new:true});
   res.json(updatedUser);
})

const deleteUser = asyncHandler( async (req,res)=>{
    const {_id} = req.user;
    const deletedUser = await userModel.findByIdAndDelete(_id);
    res.json({success:true,message:"User deleted successfully"});
})

export {
  userRegister,
  verifyEmail,
  userLogin,
  resetPassword,
  sendOtp,
  logout,
  getUser,
  updateUser,
  deleteUser
};
