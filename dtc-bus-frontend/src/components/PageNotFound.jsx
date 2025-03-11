import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-600 to-green-400 text-white text-center p-6">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl mt-2">Oops! Page Not Found.</p>
      <p className="mt-4">The page you are looking for doesn't exist or has been moved.</p>

      <Link
        to="/"
        className="mt-6 bg-white text-green-600 px-4 py-2 rounded hover:bg-red-100 transition-all duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
