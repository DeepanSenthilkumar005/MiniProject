import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logo from "../../public/Icon.jpg";
import axios from "axios";
import { backend } from "../App";

function LoginPage() {
  const [msg, setMsg] = useState("");
  const [otp, setOtp] = useState();
  const [checkOtp, setCheckOtp] = useState();
  const [showOtp, setShowOtp] = useState(false);
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(true);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Validate confirm password when typing
  useEffect(() => {
    if (!login && confirmPassword) {
      if (confirmPassword !== password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  }, [confirmPassword, password, login]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  function handleClear() {
    setMail("");
    setPassword("");
    setConfirmPassword("");
    setConfirmPasswordError("");
  }

  async function handleClick() {
    if (!mail || !password) {
      setMsg("Enter all fields");
      return;
    }

    if (!login && confirmPassword !== password) {
      setMsg("Passwords do not match");
      return;
    }

    try {
      const url = login
        ? `${backend}/api/login/auth/${mail}/${password}`
        : `${backend}/api/login/auth`;

      const res = login
        ? await axios.get(url)
        : await axios.post(url, { mail, password });

      console.log(res.data);
      setMsg(res.data);
      handleClear();
    } catch (e) {
      console.error("Error:", e.response?.data || e.message);
    }
  }

  async function handleForgetPassword() {
    console.log("Forget Password Clicked");

    if (!mail) {
      setMsg("Enter the Mail ID");
      return;
    }

    try {
      // 🔹 Check if the email exists in the database
      const response = await axios.post(`${backend}/api/login/search`, {
        mail,
      });

      console.log("Search API Response:", response.data);

      if (response.data.success) {
        console.log("Mail ID found");

        // 🔹 If email exists, send OTP
        const res = await axios.post(`${backend}/api/send-email`, {
          email: mail,
        });

        console.log("Email API Response:", res.data);

        if (res.data.success) {
          setOtp(res.data.OTP); // ✅ Fix: Ensure OTP is stored properly before comparison
          console.log("Generated OTP:", res.data.OTP);
          setMsg("OTP has been sent to your email");
          setShowOtp(true);
        } else {
          setMsg("Failed to send OTP. Try again.");
        }
      } else {
        setMsg(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error in Forget Password:", error);
      setMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-full h-svh flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm h-fit">
        <img
          alt="Your Company"
          src={logo}
          className="mx-auto h-10 w-auto rounded-sm"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {login ? "Welcome Back!" : "Register the App!"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <p className="flex justify-center text-red-500">{msg}</p>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={mail}
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                onChange={(e) => setMail(e.target.value)}
              />
            </div>
          </div>

          {showOtp && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">
                Enter OTP
              </h3>
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength="4"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter OTP"
                  className="w-32 h-12 text-center text-lg font-semibold border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 tracking-widest"
                  value={checkOtp}
                  onChange={(e) => {
                    const enteredOtp = e.target.value.replace(/\D/g, ""); // Allow only numbers
                    setCheckOtp(enteredOtp.slice(0, 4)); // Limit to 4 digits
                  }}
                />
              </div>
              {otp && checkOtp && Number(otp) !== Number(checkOtp) && (
                <p className="text-red-500 text-center mt-2">
                  OTP does not match
                </p>
              )}
            </div>
          )}

          {/* Password Field with Show/Hide */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              {login && (
                <div className="text-sm">
                  <button
                    type="button"
                    className="font-semibold text-orange-600 hover:text-orange-500 cursor-pointer"
                    onClick={handleForgetPassword}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {show ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Only for Register) */}
          {!login && (
            <div>
              <label
                htmlFor="confirmpassword"
                className="block text-sm font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
              {confirmPasswordError && (
                <p className="text-red-500">{confirmPasswordError}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="button"
              className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleClick}
            >
              {login ? "Login" : "Register"}
            </button>
          </div>
        </form>

        {/* Toggle Login/Register */}
        <p className="mt-10 text-center text-sm text-gray-500">
          {login ? "Not a member?" : "Already have an account?"}{" "}
          <span
            className="font-semibold text-orange-600 hover:text-indigo-500 cursor-pointer"
            onClick={() => setLogin(!login)}
          >
            {login ? "Create Account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
