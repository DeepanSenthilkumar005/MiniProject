import { Link } from "react-router-dom";
import backgroundImage from "../assets/image.png";

const Home = () => {
  return (
    <div
      className="text-center p-10 flex w-full items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh", // Ensure the div has height
        // position:'sticky',
      }}
            >
        <div className="relative p-4 rounded-2xl">
          {/* Background Blur */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xs shadow-zinc-50 rounded-2xl"></div>

          {/* Content (not blurred) */}
          <div className="relative z-10 p-4">
            <h1 className="text-3xl font-bold text-blue-600">Bus Scheduling System</h1>
            <p className="mt-3 text-zinc-100">Automate and manage DTC bus schedules easily.</p>
            <div className="mt-5 space-x-4">
              <Link to="/schedule" className="bg-green-500 px-4 py-2 text-white rounded">
                View Schedule
              </Link>
              <Link to="/routes" className="bg-purple-500 px-4 py-2 text-white rounded">
                Manage Routes
              </Link>
            </div>
          </div>
        </div>

    </div>
  );
};

export default Home;
