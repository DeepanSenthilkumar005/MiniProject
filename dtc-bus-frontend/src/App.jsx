import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Schedule from "./components/Schedule";
import RoutesPage from "./components/RoutesPage";
import Crew from "./components/Crew";
import Buses from "./components/Buses";
import AddItem from "./components/AddItem";
import BusRouteMap from "./components/BusRouteMap";
import PageNotFound from "./components/PageNotFound";


function App() {
  return (
    <Router>
      <NavBar />
      <div className="md:p-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/crew" element={<Crew />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/add/:category" element={<AddItem />} />
          {/* // Add a new route for the bus route map */}
          <Route path="/bus/:busId/map" element={<BusRouteMap />} />
          <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
