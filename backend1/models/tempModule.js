import mongoose from 'mongoose';


const tempUserModule = mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiry: {
      type: String,
      required: true,
    },
  }
);

const TempUser = mongoose.model('TempUser', tempUserModule);

export default TempUser;
