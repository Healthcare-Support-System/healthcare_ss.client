import React from "react";
import { useNavigate } from "react-router-dom";


const Home = () => {
const navigate = useNavigate();
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-purple-100 py-20 text-center">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">
          Give Hope. Save Lives.
        </h1>
        <p className="text-purple-700 max-w-2xl mx-auto">
          Your donation can make a difference in the lives of low-income cancer
          patients receiving treatment at Apeksha Hospital.
        </p>
      <button
        onClick={() => navigate("/support-request")}
        className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
  Donate Now
</button>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
          Why Your Help Matters
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto">
          Many cancer patients struggle with financial burdens. Your support
          helps provide medicine, treatments, and essential care.
        </p>
      </div>

      {/* Cards Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4 pb-16">
        <div className="bg-purple-50 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-purple-700">
            Medical Support
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Help patients afford chemotherapy, surgeries, and treatments.
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-purple-700">
            Emergency Aid
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Provide urgent funds for critical situations.
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-purple-700">
            Patient Care
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Support nutrition, accommodation, and daily needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
