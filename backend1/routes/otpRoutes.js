import express from 'express';
import {
    sendOtp,
    verifyOtp
} from '../controllers/otpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
// router.post('/logout', minuseBalance);

export default router;
