import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation(); // Get current route

  // Define navigation links
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/schedule", label: "Schedule" },
    { path: "/routes", label: "Routes" },
    { path: "/crew", label: "Crew" },
    { path: "/buses", label: "Bus Map" },
    { path: "/add/busstoplist", label: "Add Bus" },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on link click
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="z-50 rounded-b-sm shadow shadow-gray-800 bg-gradient-to-r from-[#FF512F] to-[#F09819] sticky top-0 p-4 flex justify-between items-center text-white transition-all ease-in-out duration-200">
      <h1 className="text-xl font-bold cursor-pointer hover:scale-110 duration-300">
        Bus Scheduling
      </h1>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-4">
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`px-3 py-2 rounded-md duration-200 ease-in-out ${
              location.pathname === link.path
                ? "bg-[#233d4d] " // Active link styling
                : "hover:text-[#233d4d] hover:scale-110"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoMdClose  size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute w-2/3 top-15 h-screen right-0 bg-gradient-to-r from-[#F87424] to-[#F09819] text-center space-y-4 py-4 md:hidden shadow-md"
        >
          {navLinks.map((link, index) => (
            <div className="w-full flex justify-center">
              
              <Link
                key={index}
                to={link.path}
                className={`block font-medium px-3 py-2 w-fit rounded-md ${
                  location.pathname === link.path ? "bg-yellow-300 text-black rounded-md " : "hover:text-yellow-300"
                }`}
                onClick={handleLinkClick}
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
