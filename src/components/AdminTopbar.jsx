import { useAuth } from "../contexts/AuthContext";

const AdminTopbar = () => {
  const { user } = useAuth();

  return (
    <div className="w-full h-20 bg-gradient-to-r from-pink-100 via-white to-purple-100 border-b shadow-sm flex items-center justify-between px-6">
      <div>
        <h1 className="text-2xl font-bold text-purple-800">
          HOPE<span className="text-pink-500">.</span>ආදරෙයි
        </h1>
      </div>

      <div className="flex-1 px-8 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-gray-800 break-words">
          Hi, {user?.email}
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {user?.role?.replace("_", " ")}
        </p>
      </div>
    </div>
  );
};

export default AdminTopbar;