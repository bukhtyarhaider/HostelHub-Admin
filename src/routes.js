import DashBoard from "./pages/DashBoard/DashBoard";
import AllWardens from "./pages/AllWardens/AllWardens";
import MyProfile from "./pages/MyProfile/MyProfile";
import WardenDetails from "./pages/WardenDetails/WardenDetails";
import Login from "./pages/Auth/Login/Login";

const routes = [
  { path: "/", element: DashBoard },
  { path: "/wardens", element: AllWardens },
  { path: "/warden-details", element: WardenDetails },
  { path: "/profile", element: MyProfile },
  { path: "/login", element: Login },
];

export default routes;
