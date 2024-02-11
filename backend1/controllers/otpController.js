import asyncHandler from 'express-async-handler';
import { Vonage } from '@vonage/server-sdk';
import TempUser from '../models/tempModule.js';

// Initialize Vonage API client
const vonage = new Vonage({
    apiKey: "fc5d091b",
    apiSecret: "5tefBbhR142miSdF"
});

// Generate a random OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP via SMS
const sendOTP = async (mobileNumber, otp) => {
    const from = "Vonage API";
    const to = '91' + mobileNumber;
    const text = `Your OTP is: ${otp}`;

    async function sendSMS() {
        await vonage.sms.send({ to, from, text })
            .then(resp => {
                console.log('Message sent successfully'); console.log(resp);
            })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    return sendSMS();
};


// @desc    Send OTP to user's phone number
// @route   POST /api/users/send-otp
// @access  Public
const sendOtp = asyncHandler(async (req, res) => {
    const { mobileNumber } = req.body;

    const otp = generateOTP();
    const expiry = Date.now() + 1 * 60 * 1000; // OTP expiry time (1 minutes)

    try {
        await sendOTP(mobileNumber, otp);

        const newTempUser = new TempUser({
            mobileNumber,
            otp,
            expiry
        })
        await newTempUser.save();

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

// @desc    Verify OTP sent to user's phone number
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
    const { mobileNumber, otp } = req.body;

    const tempUser = await TempUser.findOne({ mobileNumber });

    if (!tempUser || tempUser.otp != otp || Date.now() > tempUser.expiry) {
        res.status(401);
        throw new Error('Invalid OTP');
    } else {
        await TempUser.findByIdAndDelete(tempUser._id);
        res.status(200).json({ message: "OTP verified successfully" });
        
    }


});

export {
    sendOtp,
    verifyOtp
};
