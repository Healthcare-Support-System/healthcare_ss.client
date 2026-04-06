import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
//import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <div className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
