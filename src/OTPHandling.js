import React, { useState, useEffect, useRef, useContext} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import OTPContext from './OTPContext';

function OTPHandling() {
  const { sendOTP } = useContext(OTPContext);
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpV, setOtp] = useState(location.state?.otpValue); // Use state to keep track of OTP  
  // const otpV = location.state?.otpValue
  const email = location.state?.email;  
  const [timer, setTimer] = useState(120); // 120 seconds countdown
  const [inputOtp, setInputOtp] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const canvasRef = useRef(null);
  

  useEffect(() => {
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;

        const draw = () => {
            const angle = (timer / 120) * 2 * Math.PI;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(150, 150, 100, 0, 2 * Math.PI);
            // ctx.fillStyle = '#fff';
            // ctx.fill();

            // Draw the countdown
            ctx.beginPath();
            ctx.arc(150, 120, 80, 1.5 * Math.PI, 1.5 * Math.PI - angle, true);
            ctx.strokeStyle = getColor(timer);
            ctx.lineWidth = 80;
            ctx.stroke();

            // Adding centered text for timer
            ctx.fillStyle = "#000";
            ctx.font = "24px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${timer}s`, 150, 123); // Timer text in the middle
        };

        draw();
    }, [timer]);

const renewOTP = () => {
    sendOTP(email).then(newOtp => {
      setOtp(newOtp);  // Set new OTP received from the backend
      setTimer(120);   // Reset the timer
    }).catch(error => {
      console.error("Failed to renew OTP: ", error.message);
      setMessage("Failed to renew OTP: " + error.message);
    });
  };



 useEffect(() => {
  const countdown = setInterval(() => {
    if (timer === 1) {  // Adjust based on when you check the timer
      renewOTP();
    }
    setTimer(t => t - 1);
  }, 1000);

  return () => clearInterval(countdown);
}, [timer, renewOTP]); // Only include necessary dependencies


  
 const getColor = (time) => {
        if (time > 90) return '#0f0';
        else if (time > 60) return '#ff0';
        else if (time > 30) return '#f90';
        else return '#f00';
    };

  const verifyOTP = () => {  
    setIsVerifying(true);
    axios
      .get(`https://qlagjo8waj.execute-api.us-east-1.amazonaws.com/dev/verify_otp?email_address=${email}&otp=${otpV}`)
      .then(response => {
        console.log(response.data);
        setMessage(response.data.message); // Assuming verification result is returned
        setIsVerifying(false);
        setShowMessage(true); // Show message
        setTimeout(() => {
        setShowMessage(false); // Hide message after 10 seconds
        }, 10000);
      })
      .catch(error => {
        setMessage("Error verifying OTP. " + error.message);
        setIsVerifying(false);
        setIsVerifying(false);
        setShowMessage(true); // Show message
        setTimeout(() => {
        setShowMessage(false); // Hide message after 10 seconds
        }, 10000);
      });
  
};

  return (
    <div className="form-control text-center">
      <h2 className="text-center">OTP Verification</h2>
      <div className=" form-control text-center ">
        <div className="text-center">
            <canvas ref={canvasRef}></canvas>            
        </div>
    </div>
      <p className="otp-code">
       {otpV} 
      </p>    
      
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control my-2 text-center"
          value={inputOtp}
          onChange={e => setInputOtp(e.target.value)}
          placeholder="Enter OTP"          
        />
        {showMessage && (
          <span className="input-group-text" style={{ width: '30%', backgroundColor: showMessage ? (message.includes("Time Over") ? "#f8d7da" : "#d4edda") : "#fff" }}>
            {message}
          </span>
        )}
      </div>
      <button className="btn btn-primary center" onClick={verifyOTP} disabled={isVerifying}>Verify OTP</button>
      
    </div>
   
  );
}

export default OTPHandling;
