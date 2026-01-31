// auth/AuthBootstrap.tsx
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/authSlice";
import api from "../../utils/api";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // To prevent state updates on unmounted component in case of dev strict mode
    let cancelled = false;

    const fetchUser = async () => {
      try {
        const res = await api.get("/profile/view", {
          withCredentials: true,
        });

        if (!cancelled) {
          dispatch(setUser(res.data.user));
        }
      } catch (err) {
        if (!cancelled) dispatch(clearUser()); // Very important to clear user even on error to mark authChecked true
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  // if (loading)
  //   return (
  //     // Loading spinner
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="loading">Loading...</div>
  //     </div>
  //   );

  return <>{children}</>;
}
