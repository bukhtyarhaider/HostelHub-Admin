import "./main.scss";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import routes from "./routes";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import { observeAuthState } from "./services/firebase";
import { User } from "firebase/auth";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<User | null>();

  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      if (user) {
        setAuthUser(user);
        if (location.pathname === "/login" && !!user) {
          navigate("/");
        }
      } else {
        setAuthUser(null);
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [location.pathname, navigate]);

  return (
    <div className="app-container">
      {authUser && <Sidebar />}
      <div className="main-content-container">
        {authUser && <Header authUser={authUser} />}
        <div
          className={
            location.pathname !== "/login" && location.pathname !== "/register"
              ? "main-content"
              : ""
          }
        >
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.path === "/login" ? (
                    <route.element />
                  ) : (
                    <PrivateRoute
                      isAuthenticated={!!authUser}
                      element={route.element}
                    />
                  )
                }
              />
            ))}
            <Route
              path="*"
              element={
                <PrivateRoute
                  isAuthenticated={!!authUser}
                  element={
                    routes.find((route: { path: string }) => route.path === "/")
                      ?.element
                  }
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
