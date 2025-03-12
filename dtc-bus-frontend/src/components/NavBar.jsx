import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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
    <nav className="bg-gradient-to-r from-green-700 via-green-500 to-green-400 sticky top-0 p-4 flex justify-between items-center text-white shadow-lg z-50">
      <h1 className="text-xl font-bold">Bus Scheduling</h1>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-4">
        {navLinks.map((link, index) => (
          <Link key={index} to={link.path} className="hover:text-yellow-300">
            {link.label}
          </Link>
        ))}
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-14 left-0 w-full bg-gradient-to-r from-green-700 via-green-500 to-green-400 text-center space-y-4 py-4 md:hidden shadow-md"
        >
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="block hover:text-yellow-300"
              onClick={handleLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
