import { Outlet } from "react-router";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer";
const Body = () => {
  return (
    <div >
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
