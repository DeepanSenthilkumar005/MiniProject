import { Link } from "react-router-dom";

function NavBar() {
  return (
    
    <nav className="bg-blue-600 p-4 flex justify-between text-white">
      <h1 className="text-xl font-bold">Bus Scheduling</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/schedule" className="hover:text-gray-300">Schedule</Link>
        <Link to="/routes" className="hover:text-gray-300">Routes</Link>
        <Link to="/crew" className="hover:text-gray-300">Crew</Link>
        <Link to="/buses" className="hover:text-gray-300">Buses</Link>
      </div>
    </nav>
    
  )
}

export default NavBar

