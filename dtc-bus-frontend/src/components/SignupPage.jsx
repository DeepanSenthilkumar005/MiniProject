import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logo from "../../public/Icon.jpg"; // Adjust the path as necessary
import axios from "axios";
import { backend } from "../App";

function SignupPage() {
  const [msg, setMsg] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // Role state
  const [name, setName] = useState(""); // Name state
  const [show, setShow] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    if (confirmPassword) {
      if (confirmPassword !== password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  }, [confirmPassword, password]);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  async function handleSignup() {
    if (!mail || !password || !role || !name) {
      setMsg("Enter all fields");
      return;
    }

    if (confirmPassword !== password) {
      setMsg("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${backend}/api/login/auth`, {
        mail,
        password,
        name,
        role,
      });

      if (res.data === "✅ User registered successfully") {
        setMsg("Registration successful! You can now log in.");
        // Clear input fields
        setMail("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        setName("");
        // Redirect to login page
        window.location.href = "/login";
      } else {
        setMsg(res.data);
      }
    } catch (e) {
      console.error("Error:", e.response?.data || e.message);
      setMsg("Registration failed. Try again.");
    }
  }

  return (
    <div className="flex min-h-full h-svh flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm h-fit">
        <img alt="Logo" src={logo} className="mx-auto h-10 w-auto rounded-sm" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Register the App!
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <p className={`flex justify-center ${msg.includes("✅") ? "text-green-500" : "text-red-500"}`}>
            {msg}
          </p>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
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

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
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

          {/* Password Field with Show/Hide */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
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

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-900">
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
            {confirmPasswordError && <p className="text-red-500">{confirmPasswordError}</p>}
          </div>

          {/* Role Dropdown */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-900">
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
                <option value="" disabled>Select your role</option>
                <option value="Passenger">Passenger</option>
                <option value="Admin">Admin</option>
                <option value="Driver">Driver</option>
                <option value="Conductor">Conductor</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="button"
              className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSignup}
            >
              Register
            </button>
          </div>
        </form>

        {/* Toggle to Login */}
        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            className="font-semibold text-orange-600 hover:text-indigo-500 cursor-pointer"
            onClick={() => window.location.href = "/login"} // Redirect to Login
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;