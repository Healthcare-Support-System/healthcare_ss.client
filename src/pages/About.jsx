import React from "react";

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-purple-100 py-16 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-800">
          About Us
        </h1>
        <p className="text-purple-700 mt-4 max-w-2xl mx-auto">
          We are dedicated to supporting low-income cancer patients by
          connecting generous donors with those in urgent need of medical care.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to provide financial assistance and hope to cancer
            patients receiving treatment at Apeksha Hospital in Sri Lanka. We
            aim to reduce the burden of medical expenses and ensure every
            patient gets the care they deserve.
          </p>
        </div>
        <div className="bg-purple-50 p-8 rounded-xl shadow">
          <p className="text-purple-700 italic">
            "Every donation brings hope, healing, and a chance for life."
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-purple-800 mb-10">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-purple-700">
                Compassion
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                We care deeply about patients and their families.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-purple-700">
                Transparency
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Every donation is tracked and used responsibly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-purple-700">Impact</h3>
              <p className="text-sm text-gray-600 mt-2">
                We ensure your support creates real change.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 text-center px-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          Join Us in Saving Lives
        </h2>
        <p className="text-gray-600 mb-6">
          Together, we can make a difference in the lives of cancer patients.
        </p>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Start Donating
        </button>
      </div>
    </div>
  );
};

export default About;
