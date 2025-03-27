import { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../App";

const Crew = () => {
  const [crewMembers, setCrewMembers] = useState([]);
  const [status, setStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // ❌ Store error message
  const [formData, setFormData] = useState({
    name: "",
    role: "Driver", // Default role
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
      .then((res) => setCrewMembers(res.data))
      .catch((err) => console.error("Error fetching crew:", err));
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // ✅ Clear error message on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.role ||
      !formData.contact ||
      !formData.mail
    ) {
      setErrorMessage("⚠️ Please fill all fields.");
      return;
    }

    try {
      setStatus(false);
      // **Step 1: Check if Email Already Exists in Login Collection**
      const checkEmailRes = await axios.post(`${backend}/api/login/search`, {
        mail: formData.mail,
      });

      if (checkEmailRes.data.success) {
        setErrorMessage(
          "⚠️ Email already exists. Please use a different email."
        );
        return;
      }
      // **Step 2: Add Crew Member to Crew Collection**
      await axios.post(`${backend}/api/crew`, formData);
      alert("✅ Crew member added successfully!");
      fetchCrew(); // Refresh crew list

      // **Step 3: Send Crew Member Data to Login System with Default Password**
      await axios.post(`${backend}/api/login/auth`, {
        mail: formData.mail,
        password: "1", // ✅ Default Password
        name: formData.name,
        role: formData.role,
      });

      // **Step 4: Send Email Notification**
      await axios.post(`${backend}/api/send-email`, {
        email: formData.mail,
        msg: {
          name: formData.name,
          role: formData.role,
          password: "1", // ✅ Include Default Password in Email
        },
      });

      // ✅ Reset Form
      setFormData({ name: "", role: "Driver", contact: "", mail: "" });
    } catch (err) {
      console.error("❌ Error:", err);
      setErrorMessage("❌ Failed to add crew member. Try again.");
    } finally {
      setStatus(true);
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🚍 Bus Crew Members
      </h2>

      {/* Error Message Display */}
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}

      {/* Crew Form */}
      {!!sessionStorage.getItem("auth") && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">➕ Add Crew Member</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              disabled={!status}
              className="p-2 border rounded w-full"
              required
            />

            {/* Role Dropdown */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              disabled={!status}
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
              disabled={!status}
              className="p-2 border rounded w-full"
              required
            />
            <input
              type="email"
              name="mail"
              placeholder="Email"
              value={formData.mail}
              onChange={handleChange}
              disabled={!status}
              className="p-2 border rounded w-full lowercase"
              required
            />

            <button
              type="submit"
              className="col-span-1 md:col-span-2 cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition w-full"
            >
              {status ? "Add Crew Member" : <p>Submitting...</p>}
            </button>
          </form>
        </div>
      )}

      {/* Crew List */}
      {crewMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crewMembers.map((member) => (
            <div
              key={member._id}
              className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-700">
                {member.name}
              </h3>
              <p>
                <strong>🛠 Role:</strong> {member.role}
              </p>
              <p>
                <strong>📞 Contact:</strong> {member.contact}
              </p>
              <p>
                <strong>📧 Email:</strong>{" "}
                <a href={`mailto:${member.mail}`} className="text-blue-500">
                  {member.mail}
                </a>
              </p>
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
