import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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
        <Link to="/" className="hover:text-yellow-300">Home</Link>
        <Link to="/schedule" className="hover:text-yellow-300">Schedule</Link>
        <Link to="/routes" className="hover:text-yellow-300">Routes</Link>
        <Link to="/crew" className="hover:text-yellow-300">Crew</Link>
        <Link to="/buses" className="hover:text-yellow-300">Bus Map</Link>
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
          <Link to="/" className="block hover:text-yellow-300" onClick={handleLinkClick}>Home</Link>
          <Link to="/schedule" className="block hover:text-yellow-300" onClick={handleLinkClick}>Schedule</Link>
          <Link to="/routes" className="block hover:text-yellow-300" onClick={handleLinkClick}>Routes</Link>
          <Link to="/crew" className="block hover:text-yellow-300" onClick={handleLinkClick}>Crew</Link>
          <Link to="/buses" className="block hover:text-yellow-300" onClick={handleLinkClick}>Buses</Link>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
