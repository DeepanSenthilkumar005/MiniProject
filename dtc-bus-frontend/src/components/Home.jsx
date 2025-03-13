import { Link } from "react-router-dom";
import backgroundImage from "../assets/Home/BgVideo.mp4";
// import backgroundImage from "../assets/Home/bg.jpeg";

const Home = () => {
  return (
    <div
      className="text-center p-10 flex w-full items-center h-svh relative justify-center bg-gray-100"
      // style={{
      //   // backgroundImage: `url(${backgroundImage})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   height: "100vh", // Ensure the div has height
      //   // position:'sticky',
      // }}
    >
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        src={backgroundImage}
      ></video>
      <div className="relative p-4 rounded-2xl">
        {/* Background Blur */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xs shadow-zinc-50 rounded-2xl"></div>

        {/* Content (not blurred) */}
        <div className="relative z-10 p-4">
          <h1 className="text-3xl font-bold text-600 text-white ">
            Bus Scheduling System
          </h1>
          <p className="mt-3 text-zinc-100">
            Automate and manage DTC bus schedules easily.
          </p>
          <div className="mt-5 gap-4 w-full grid md:flex space-x-4">
            <Link
              to="/schedule"
              className="bg-orange-500/90 px-4 py-2 text-white rounded w-full"
            >
              View Schedule
            </Link>
            <Link
              to="/routes"
              className="bg-yellow-500/90 px-4 py-2 text-white rounded w-full"
            >
              Manage Routes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
