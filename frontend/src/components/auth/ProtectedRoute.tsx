import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { RootState } from "../../store/store";

export function ProtectedRoute() {
  const { user, authChecked } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Do NOT render loading UI here
  if (!authChecked) {
    return <Outlet />; // let layout + skeletons render
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
