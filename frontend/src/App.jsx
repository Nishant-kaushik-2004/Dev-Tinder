import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Body from "./body";
import Login from "./components/login";
import Signup from "./components/signup";
import DevTinderApp from "./homePage";
import EditProfile from "./components/edit-profile/editProfile";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addUser } from "./store/userSlice";
import axios from "axios";
import MatchesPage from "./components/matched-profiles/connections";
import MatchRequests from "./components/match-request/matchRequests";
import UserProfilePage from "./components/user-profile/userProfilePage";

const App = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    // const token = cookieStore.get(token);
    // if (token) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/profile/view`,
        { withCredentials: true }
      );

      if (response.status == 200) {
        console.log(response.data.user);
        dispatch(addUser(response.data.user));
      }
    } catch (error) {
      console.log(error.response?.data);
      const errorMessage = error.response?.data || "No User found";
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Layout route */}
          <Route element={<Body />}>
            <Route index element={<DevTinderApp />} /> {/* Home route */}
            <Route path="profile" element={<EditProfile />} />
            <Route path="connections" element={<MatchesPage />} />
            <Route path="requests" element={<MatchRequests />} />
            <Route path="user" element={<UserProfilePage />} />
          </Route>

          {/* Auth routes outside layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
