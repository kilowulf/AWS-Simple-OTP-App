// OTPContext.js
import React from "react";

const OTPContext = React.createContext({
  sendOTP: () => {},
  otp: null
});

export default OTPContext;
