import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, element: Element, ...rest }) => {
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
