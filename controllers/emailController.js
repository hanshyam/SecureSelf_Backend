import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';

const sendEmail = asyncHandler(async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MY_EMAIL_USER,
        pass: process.env.MY_EMAIL_PASS
      },
    });

    const info = await transporter.sendMail({
      from: '"hey 👻" <secureself05@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    console.log("Message sent: %s", info.messageId);
    return true; // Indicate that the email was sent successfully
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
});

export default sendEmail;