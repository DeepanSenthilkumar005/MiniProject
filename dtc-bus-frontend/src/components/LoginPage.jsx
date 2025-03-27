import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { backend } from "../App";
import logo from "../../public/Icon.jpg";
import { Link } from "react-router-dom";

function Login() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  async function handleLogin() {
    if (!mail || !password) {
      setMsg("⚠️ Enter all required fields");
      return;
    }

    try {
      setStatus(true);
      const res = await axios.get(
        `${backend}/api/login/auth/${mail}/${password}`
      );

      if (res.data.msg === "✅ Valid Password") {
        sessionStorage.setItem("auth", "true");
        sessionStorage.setItem("role", res.data.role);
        sessionStorage.setItem("name", res.data.name);

        if (res.data.role === "Driver" || res.data.role === "Conductor") {
          sessionStorage.setItem("userId", mail);
        }

        // Send login notification email
        await axios.post(`${backend}/api/send-email`, {
          email: mail,
          msg: { name: res.data.name, role: "Login" },
        });

        window.location.href = "/";
      } else {
        setMsg(res.data);
      }
    } catch (error) {
      setMsg("❌ Login failed. Try again.");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setStatus(false);
    }
  }

  async function handleForgetPassword() {
    if (!mail) {
      setMsg("⚠️ Enter your email to reset password.");
      return;
    }

    try {
      const response = await axios.post(`${backend}/api/login/search`, {
        mail,
      });

      if (response.data.success) {
        const res = await axios.post(`${backend}/api/send-email`, {
          email: mail,
          msg: "Password Changed",
        });

        if (res.data.success) {
          setOtp(res.data.OTP);
          setMsg("✅ OTP sent to your email.");
          setShowOtp(true);
        } else {
          setMsg("❌ Failed to send OTP.");
        }
      } else {
        setMsg(response.data.message);
      }
    } catch (error) {
      setMsg("❌ Error. Try again.");
    }
  }

  async function handleResetPassword() {
    // console.log(otp);

    if (!enteredOtp) {
      setMsg("⚠️ Enter the OTP.");
      return;
    }

    if (enteredOtp != otp) {
      setMsg("❌ Incorrect OTP. Please try again.");
      return;
    }

    if (!newPassword) {
      setMsg("⚠️ Enter a new password.");
      return;
    }

    try {
      const res = await axios.put(`${backend}/api/login/pass`, {
        mail: mail,
        password: newPassword,
      });

      if (res.data.success) {
        setMsg("✅ Password reset successful. Please login.");
        setShowOtp(false);
        setEnteredOtp("");
        setNewPassword("");
      } else {
        setMsg("❌ Failed to reset password.");
      }
    } catch (error) {
      setMsg("❌ Error resetting password.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img alt="Logo" src={logo} className="mx-auto h-10 w-auto rounded-sm" />
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Welcome Back!
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6">
          <p
            className={`text-center ${
              msg.includes("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {msg}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              value={mail}
              disabled={status ? true : false}
              required
              className="mt-2 block w-full border border-gray-300 rounded-md p-2"
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          {!showOtp ? (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-orange-600 hover:underline"
                    onClick={handleForgetPassword}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mt-2 relative">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    disabled={status ? true : false}
                    required
                    className="block w-full border border-gray-300 rounded-md p-2"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={status ? true : false}
                className="w-full bg-orange-600 text-white py-2 rounded-md"
                onClick={handleLogin}
              >
                {status ? "Submitting.." : "Login"}
              </button>
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength="4"
                  className="mt-2 block w-full border border-gray-300 rounded-md p-2"
                  value={enteredOtp}
                  onChange={(e) =>
                    setEnteredOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                />
              </div>

              {/* New Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  New Password
                </label>
                <input
                  type="password"
                  className="mt-2 block w-full border border-gray-300 rounded-md p-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="w-full bg-green-600 text-white py-2 rounded-md"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </>
          )}
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link to="/signup" className="text-orange-600 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
