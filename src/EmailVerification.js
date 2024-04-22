import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmailVerification() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOTP = () => {
    axios
      .get(
        `https://qlagjo8waj.execute-api.us-east-1.amazonaws.com/dev/send_otp?email_address=${email}`
      )
      .then(response => {
        console.log(response.data);
        console.log(response.data.otp);
        const otpValue = response.data.otp;
        navigate("/otp", { state: { email, otpValue } }); // Navigate with email state
      })
      .catch(error => {
        setMessage("Error sending OTP: " + error.message);
      });
  };

  const checkEmailStatus = () => {
    axios
      .get(
        `https://qlagjo8waj.execute-api.us-east-1.amazonaws.com/dev/check-status?email=${email}`
      )
      .then(response => {
        console.log(response.data.VerificationStatus);
        const verificationStatus = response.data.VerificationStatus;
        switch (verificationStatus) {
          case "Success":
            setMessage("Email already verified.");
            sendOTP(); // Call sendOTP directly after verification
            break;
          case "Pending":
            setMessage("Verification email sent! Please check your email.");
            // Optionally display a button to resend the verification email
            handleVerification();
            break;
          case "Not Found":
            setMessage("Verification email sent! Please check your email.");
            // Optionally display a button to resend the verification email
            handleVerification();
            break;
          default:
            setMessage(`Email status: ${verificationStatus}`);
            // Display a button to resend the verification email if needed
            break;
        }
      })
      .catch(error => {
        setMessage("Error checking email status: " + error.message);
      });
  };

  const handleVerification = () => {
    axios
      .post(
        `https://qlagjo8waj.execute-api.us-east-1.amazonaws.com/dev/send-verification?email=${email}`
      )
      .then(response => {
        setMessage("Verification email sent! Check your email.");
      })
      .catch(error => {
        setMessage("Failed to send verification email. " + error.message);
      });
  };

  return (
    <div>
      <h2 className="text-center">Email Verification</h2>
      <div className="form-group text-center">
        <input
          value={email}
          className="form-control my-3 text-center"
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ width: "100%" }}
        />
        <button className="btn btn-primary" onClick={checkEmailStatus}>
          Verify Email
        </button>
        <p
          className={message.includes("Error") ? "text-danger" : "text-success"}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default EmailVerification;
