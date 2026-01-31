import { Outlet } from "react-router";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";
import NavbarSkeleton from "./components/navbar/NavbarSkeleton";
const Body = () => {
  const { authChecked, user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen flex flex-col custom-scrollbar">
      {/* {!authChecked ? <NavbarSkeleton /> : user ? <Navbar /> : null} */}
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
