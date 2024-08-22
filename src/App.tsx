import "./main.scss";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import routes from "./routes";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Sidebar />
      )}

      <div className="main-content">
        {location.pathname !== "/login" &&
          location.pathname !== "/register" && <Header />}
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.path === "/login" ? (
                  <route.element />
                ) : (
                  <PrivateRoute element={route.element} />
                )
              }
            />
          ))}
          <Route
            path="*"
            element={
              <PrivateRoute
                element={routes.find((route) => route.path === "/")?.element}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
