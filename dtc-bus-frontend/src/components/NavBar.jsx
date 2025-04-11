import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("auth"));
  const [role, setRole] = useState(sessionStorage.getItem("role"));
  const [userName, setUserName] = useState(sessionStorage.getItem("name"));

  const menuRef = useRef(null);
  const location = useLocation(); // Get current route

  // ✅ Listen for sessionStorage changes
  useEffect(() => {
    const updateAuthStatus = () => {
      setIsAuthenticated(!!sessionStorage.getItem("auth"));
      setRole(sessionStorage.getItem("role"));
      setUserName(sessionStorage.getItem("name"));
    };
    window.addEventListener("storage", updateAuthStatus);
    return () => window.removeEventListener("storage", updateAuthStatus);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      setIsAuthenticated(false);
      setRole(null);
      setUserName(null);
    }
  };

  // Navigation Links (Dynamically Update Based on Auth)
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/schedule", label: "Schedule" },
    { path: "/routes", label: "Routes" },
    { path: "/crew", label: "Crew" },
    (!!sessionStorage.getItem("role") && (sessionStorage.getItem("role")=="Driver" || sessionStorage.getItem("role")=="Admin"))&&{path:"/track", label:"Track Driver"},
    role === "Admin" && { path: "/buses", label: "Add Bus" }, // ✅ Only for Admin
    role === "Admin" && { path: "/add/busstoplist", label: "Add Stop" }, // ✅ Only for Admin
    isAuthenticated
      ? { path: "/login", label: "Logout", action: handleLogout } // ✅ Logout button
      : { path: "/login", label: "Login" }, // ✅ Login button
  ].filter(Boolean); // ✅ Remove `null` values from array

  return (
    <nav className="z-50 rounded-b-sm shadow shadow-gray-800 bg-gradient-to-r from-[#FF512F] to-[#F09819] sticky top-0 p-4 flex justify-between items-center text-white transition-all ease-in-out duration-200">
      <h1 className="text-xl font-bold cursor-pointer hover:scale-110 duration-300">
        Bus360{userName &&<abbr className="no-underline" title={role}>-{userName}</abbr>}
      </h1>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-4">
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={link.action ? link.action : undefined} // ✅ Handle Logout Click
            className={`px-3 py-2 rounded-md duration-200 ease-in-out ${
              location.pathname === link.path
                ? "bg-[#233d4d]" // Active Link
                : "hover:text-[#233d4d] hover:scale-110"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoMdClose size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute w-2/3 h-svh top-15 right-0 bg-gradient-to-r from-[#F87424] to-[#F09819] text-center space-y-4 py-4 md:hidden shadow-md"
        >
          {navLinks.map((link, index) => (
            <div key={index} className="w-full flex justify-center">
              <Link
                to={link.path}
                onClick={() => {
                  if (link.action) link.action(); // ✅ Handle Logout
                  setIsOpen(false);
                }}
                className={`block font-medium px-3 py-2 w-fit rounded-md ${
                  location.pathname === link.path
                    ? "bg-yellow-300 text-black rounded-md"
                    : "hover:text-yellow-300"
                }`}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
