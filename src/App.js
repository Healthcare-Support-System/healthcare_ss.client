// import { Outlet, useLocation } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import { ROUTES } from "./routes/path";

// function App() {
//   const location = useLocation();

//   const hideLayoutRoutes = [
//     ROUTES.ADMIN_DASHBOARD,
//     ROUTES.SOCIAL_WORKER_DASHBOARD,
//   ];

//   const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

//   return (
//     <>
//       {!shouldHideLayout && <Navbar />}
//       <Outlet />
//       {!shouldHideLayout && <Footer />}
//     </>
//   );
// }

// export default App;

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Outlet />
      <Footer />
    </>
  );
}

export default App;