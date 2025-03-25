import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logo from "../../public/Icon.jpg";
import axios from "axios";
import { backend } from "../App";

function LoginPage() {
  const [msg, setMsg] = useState("");
  const [otp, setOtp] = useState();
  const [id, setId] = useState();
  const [checkOtp, setCheckOtp] = useState();
  const [showOtp, setShowOtp] = useState(false);
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(true);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Role state
  const [name, setName] = useState(""); // Name state
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    if (!login && confirmPassword) {
      if (confirmPassword !== password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  }, [confirmPassword, password, login]);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  function handleClear() {
    setMail("");
    setPassword("");
    setRole("");
    setName(""); // Clear name
    setConfirmPassword("");
    setConfirmPasswordError("");
  }

  async function handleClick() {
    if (!showOtp) {
      if (!mail || !password || (!login && (!role || !name))) {
        setMsg("Enter all required fields");
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

        const payload = login
          ? {} // No additional data for login
          : { mail, password, name, role }; // Include name and role for registration

        const res = login
          ? await axios.get(url) // GET request for login
          : await axios.post(url, payload); // POST request for registration

        if (res.data.msg === "✅ Valid Password") {
          sessionStorage.setItem("auth", "true");
          sessionStorage.setItem("role", res.data.role); // Store role only during registration
          window.location.href = "/";
        }
        console.log(res.data);
        setMsg(res.data);
        handleClear();
      } catch (e) {
        console.error("Error:", e.response?.data || e.message);
        setMsg("Login/Register failed. Try again.");
      }
    } else {
      if (Number(otp) !== Number(checkOtp)) {
        setMsg("OTP does not match");
        return;
      }

      try {
        const result = await axios.put(`${backend}/api/login/pass`, {
          mail: mail,
          password: password,
        });

        setMsg(result.data.message);
        setMail("");
        setCheckOtp();
        setOtp();
        setRole("");
        setPassword("");
        setConfirmPassword("");
        setShow(false);
      } catch (error) {
        console.error("❌ Error Updating Password:", error);
        setMsg("Failed to update password. Please try again.");
      }
    }
  }

  async function handleForgetPassword() {
    if (!mail) {
      setMsg("Enter the Mail ID");
      return;
    }

    try {
      const response = await axios.post(`${backend}/api/login/search`, {
        mail,
      });

      if (response.data.success) {
        setId(response.data.id);
        const res = await axios.post(`${backend}/api/send-email`, {
          email: mail,
        });

        if (res.data.success) {
          setOtp(res.data.OTP);
          setMsg("✅ OTP has been sent to your email");
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
        <img alt="Logo" src={logo} className="mx-auto h-10 w-auto rounded-sm" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {login ? "Welcome Back!" : "Register the App!"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <p
            className={`flex justify-center ${
              msg.includes("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {msg}
          </p>

          {/* Name Field */}
          {!login && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

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
                    const enteredOtp = e.target.value.replace(/\D/g, "");
                    setCheckOtp(enteredOtp.slice(0, 4));
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

              {/* Role Dropdown */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-900"
                >
                  Role
                </label>
                <div className="mt-2">
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="Passenger">Passenger</option>
                    <option value="Admin">Admin</option>
                    <option value="Driver">Driver</option>
                    <option value="Conductor">Conductor</option>
                  </select>
                </div>
              </div>
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
