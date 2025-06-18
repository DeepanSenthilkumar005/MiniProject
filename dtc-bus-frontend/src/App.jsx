import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Schedule from "./components/Schedule";
import RoutesPage from "./components/RoutesPage";
import Crew from "./components/Crew";
import Buses from "./components/Buses";
import AddItem from "./components/AddItem";
import BusRouteMap from "./components/BusRouteMap";
import PageNotFound from "./components/PageNotFound";
import Login from "./components/LoginPage";
import AddBusStopList from "./components/AddBusStopList";
import BusTracker from "./components/BusTracker";
import DriverSchedule from "./components/DriverSchedule";
import SignupPage from "./components/SignupPage";
import AdminBusTracker from "./components/AdminBusTracker";

export const backend = "https://miniproject-g9lj.onrender.com";
// export const backend = "http://localhost:8000"; 

function App() {
  return (
    <div className="poppins">
      <Router>
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/track"
            element={
              sessionStorage.getItem("role") === "Driver" ? (
                <BusTracker />
              ) : sessionStorage.getItem("role") === "Admin" && (
                <AdminBusTracker />
              ) 
            }
          />
          {!!!sessionStorage.getItem("userId") ? (
            <Route path="/schedule" element={<Schedule />} />
          ) : (
            <Route path="/schedule" element={<DriverSchedule />} />
          )}

          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/crew" element={<Crew />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/add/:category" element={<AddItem />} />
          <Route
            path="/add/busstoplist"
            element={
              !!sessionStorage.getItem("auth") ? (
                <AddBusStopList />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {/* // Add a new route for the bus route map */}
          <Route path="/bus/:busId/map" element={<BusRouteMap />} />
          {/* <Route path="/driver" element={<DriverSchedule />} /> */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
