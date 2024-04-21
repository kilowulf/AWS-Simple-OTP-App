import "bootstrap/dist/css/bootstrap.min.css";
import EmailVerification from "./EmailVerification";
import OTPHandling from "./OTPHandling";
import Verified from "./Verified";
import OTPContext from "./OTPContext";
import axios from "axios";
import "./App.css";
import React, { useState, useCallback } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const sendOTP = useCallback(email => {
    return axios
      .get(
        `https://qlagjo8waj.execute-api.us-east-1.amazonaws.com/dev/send_otp?email_address=${email}`
      )
      .then(response => {
        console.log("OTP sent: ", response.data.otp);
        return response.data.otp; // Ensure you return the OTP from the promise
      })
      .catch(error => {
        console.error("Error sending OTP: ", error.message);
        throw error; // Make sure to throw the error so you can catch it in OTPHandling
      });
  }, []);

  const [otpDetails] = useState({
    otp: null,
    sendOTP: sendOTP
  });

  return (
    <Router>
      <OTPContext.Provider value={otpDetails}>
        <div className="container mt-5">
          <h1 className="mb-4 text-center bg-primary text-white py-3">
            OTP System
          </h1>
          <Routes>
            <Route path="/" element={<EmailVerification />} />
            <Route path="/otp" element={<OTPHandling />} />
            <Route path="/verified" element={<Verified />} />
          </Routes>
        </div>
      </OTPContext.Provider>
    </Router>
  );
}

export default App;
