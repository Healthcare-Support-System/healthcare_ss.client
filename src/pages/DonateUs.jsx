// import React, { useEffect, useState } from "react";
// import DonationFormPopup from "../pages/DonationFormPopup";
// import { useAuth } from "../contexts/AuthContext";
// import { privateApiClient } from "../api/apiClient";
// import { END_POINTS } from "../api/endPoints";

// const DonateUs = () => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedRequestId, setSelectedRequestId] = useState(null);
//   const [donorProfile, setDonorProfile] = useState(null);
//   const { user } = useAuth();

//   // ⚠️ TEMP donor (until login fixed)
//  const legacyDonor = {
//   id: user?.id || localStorage.getItem("donorId"),
//   first_name: user?.first_name || "",
//   full_name:
//     user?.full_name ||
//     user?.name ||
//     localStorage.getItem("donorName") ||
//     "",
// };

//   useEffect(() => {
//     const fetchDonorProfile = async () => {
//       if (user?.role !== "donor") {
//         return;
//       }

//       try {
//         const { data } = await privateApiClient.get(END_POINTS.GET_DONOR_PROFILE);
//         setDonorProfile(data);

//         if (data?.id) {
//           localStorage.setItem("donorId", data.id);
//         }

//         if (data?.full_name) {
//           localStorage.setItem("donorName", data.full_name);
//         }
//       } catch (error) {
//         console.error("Unable to load donor profile", error);
//       }
//     };

//     fetchDonorProfile();
//   }, [user?.role]);

//   const donor = {
//     id: donorProfile?.id || localStorage.getItem("donorId") || "",
//     first_name: donorProfile?.first_name || legacyDonor.first_name || "",
//     full_name:
//       donorProfile?.full_name ||
//       legacyDonor.full_name ||
//       "",
//   };

//   // ✅ REAL SUPPORT REQUEST (from your DB)
//   const donationRequests = [
//     {
//       _id: "69c8ee5867277508b2b030fd",
//       request_type: "Medical Support",
//       description: "Need medicines for asthma",
//       urgency_level: "High",
//       status: "pending",
//     },
//   ];

//   const handleDonateClick = (id) => {
//     if (!donor.id) {
//       alert("Your donor profile is still loading. Please try again in a moment.");
//       return;
//     }

//     setSelectedRequestId(id);
//     setIsPopupOpen(true);
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Donate & Save Lives</h1>

//       {donationRequests.map((req) => (
//         <div key={req._id} style={card}>
//           <h3>{req.request_type}</h3>
//           <p>{req.description}</p>

//           <p><strong>Urgency:</strong> {req.urgency_level}</p>
//           <p><strong>Status:</strong> {req.status}</p>

//           <button
//             style={donateBtn}
//             onClick={() => handleDonateClick(req._id)}
//           >
//             Donate
//           </button>
//         </div>
//       ))}

//       <DonationFormPopup
//         isOpen={isPopupOpen}
//         onClose={() => setIsPopupOpen(false)}
//         requestId={selectedRequestId} // ✅ REAL ID NOW
//         donor={donor}
//       />
//     </div>
//   );
// };

// export default DonateUs;

// const card = {
//   border: "1px solid #ddd",
//   padding: "1.5rem",
//   marginBottom: "1rem",
//   borderRadius: "10px",
// };

// const donateBtn = {
//   background: "#C0442B",
//   color: "white",
//   padding: "10px 15px",
//   border: "none",
//   borderRadius: "8px",
//   cursor: "pointer",
// };

import React from "react";
import ViewAllSupportRequests from "./supportRequests";

const DonateUs = () => {
  return (
    <div>
      <ViewAllSupportRequests />
    </div>
  );
}
export default DonateUs;