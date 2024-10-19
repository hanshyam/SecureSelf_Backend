
// import twilio from 'twilio';

// const client = twilio(accountSid, authToken);

// const sendPhone = async (toPhoneNumber, otp) => {
//   try {
//     const message = await client.messages.create({
//       body: `Your OTP code is ${otp}`, // The SMS body
//       from: twilioPhoneNumber,          // Your Twilio phone number
//       to: toPhoneNumber,                // The recipient's phone number
//     });

//     console.log('Message sent:', message.sid);
//     return message.sid;
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//     throw new Error('Failed to send SMS');
//   }
// };
// export default sendPhone;
