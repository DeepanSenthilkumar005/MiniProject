import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold text-blue-600">Bus Scheduling System</h1>
      <p className="mt-3 text-gray-700">Automate and manage DTC bus schedules easily.</p>
      <div className="mt-5 space-x-4">
        <Link to="/schedule" className="bg-green-500 px-4 py-2 text-white rounded">
          View Schedule
        </Link>
        <Link to="/routes" className="bg-purple-500 px-4 py-2 text-white rounded">
          Manage Routes
        </Link>
      </div>
    </div>
  );
};

export default Home;
