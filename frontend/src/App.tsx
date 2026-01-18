import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Body from "./body";
import Login from "./components/login";
import Signup from "./components/signup";
import Feed from "./components/discover-page/feed";
import EditProfile from "./components/edit-profile/editProfile";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "./store/userSlice";
import axios, { AxiosError } from "axios";
import MatchesPage from "./components/matched-profiles/connections";
import MatchRequests from "./components/match-request/matchRequests";
import UserProfilePage from "./components/user-profile/userProfilePage";
import MessagesPage from "./components/messages-page/messagesPage";
import ChatWindow from "./components/messages-page/chatWindow";
import ChatWindowFallback from "./components/messages-page/chatWindowFallback";

const App = () => {
  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const dispatch = useDispatch();

  const fetchData = async () => {
    // const token = cookieStore.get(token);
    // if (token) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/profile/view`,
        { withCredentials: true },
      );

      if (response.status == 200) {
        console.log(response.data.user);
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data || "No User found";
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
            <Route index element={<Feed />} /> {/* Home route */}
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="user/:userId" element={<UserProfilePage />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="requests" element={<MatchRequests />} />
            {/* <Route path="chat" element={<Chat />} /> */}
          </Route>

          {/* Messages Page with nested routes outside layout */}
          <Route path="/messages" element={<MessagesPage />}>
            <Route index element={<ChatWindowFallback />} />
            <Route path=":chatId" element={<ChatWindow />} />
            <Route path="user/:userId" element={<ChatWindow />} />
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
