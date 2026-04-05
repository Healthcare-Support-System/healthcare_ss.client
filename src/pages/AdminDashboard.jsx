import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">This page is under construction.</p>

      <button
        onClick={() => navigate("/manage-donation-requests")}
        className="mt-5 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Manage Donation Requests
      </button>
    </div>
  );
};

export default AdminDashboard;