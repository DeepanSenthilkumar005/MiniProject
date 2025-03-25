import { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../App";

const Crew = () => {
  const [crewMembers, setCrewMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "Driver", // Default value
    contact: "",
    mail: "",
  });

  // Fetch Crew Members
  useEffect(() => {
    fetchCrew();
  }, []);

  const fetchCrew = () => {
    axios
      .get(`${backend}/api/crew`)
      .then((res) => {
        setCrewMembers(res.data);
      })
      .catch((err) => console.error("Error fetching crew:", err));
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.contact || !formData.mail) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    axios
      .post(`${backend}/api/crew`, formData)
      .then((res) => {
        alert("✅ Crew member added successfully!");
        fetchCrew();
        setFormData({ name: "", role: "Driver", contact: "", mail: "" }); // Reset form
      })
      .catch((err) => {
        console.error("Error adding crew:", err);
        alert("❌ Failed to add crew member.");
      });
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🚍 Bus Crew Members</h2>

      {/* Crew Form */}
      {!!sessionStorage.getItem("auth") && <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-3">➕ Add Crew Member</h3>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-1 md:grid-cols-2 md:gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          
          {/* Role Dropdown */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="Driver">Driver</option>
            <option value="Conductor">Conductor</option>
          </select>

          <input
            type="number"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            name="mail"
            placeholder="Email"
            value={formData.mail}
            onChange={handleChange}
            className="p-2 border rounded lowercase"
            required
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Crew Member
          </button>
        </form>
      </div>}

      {/* Crew List */}
      {crewMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crewMembers.map((member) => (
            <div
              key={member._id}
              className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-700">{member.name}</h3>
              <p><strong>🛠 Role:</strong> {member.role}</p>
              <p><strong>📞 Contact:</strong> {member.contact}</p>
              <p><strong>📧 Email:</strong> <a href={`mailto:${member.mail}`} className="text-blue-500">{member.mail}</a></p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500 text-center">No crew members found.</p>
      )}
    </div>
  );
};

export default Crew;
