import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { RootState } from "../../store/store";

export function ProtectedRoute() {
  const { user, authChecked } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!authChecked) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
