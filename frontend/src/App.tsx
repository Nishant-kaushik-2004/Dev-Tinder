import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Body from "./body";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Feed from "./components/discover-page/feed";
import EditProfile from "./components/edit-profile/editProfile";
import { useEffect } from "react";
import MatchesPage from "./components/matched-profiles/connections";
import MatchRequests from "./components/match-request/matchRequests";
import UserProfilePage from "./components/profile-page/userProfilePage";
import MessagesPage from "./components/messages-page/messagesPage";
import ChatWindow from "./components/messages-page/chatWindow";
import ChatWindowFallback from "./components/messages-page/chatWindowFallback";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const App = () => {
  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Protected app */}
        <Route element={<ProtectedRoute />}>
          {/* Main layout */}
          <Route element={<Body />}>
            <Route index element={<Feed />} />

            <Route path="profile" element={<UserProfilePage />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="user/:userId" element={<UserProfilePage />} />

            <Route path="matches" element={<MatchesPage />} />
            <Route path="requests" element={<MatchRequests />} />
          </Route>

          {/* Messages (outside Body layout) */}
          <Route path="messages" element={<MessagesPage />}>
            <Route index element={<ChatWindowFallback />} />
            <Route path=":chatId" element={<ChatWindow />} />
            <Route path="user/:userId" element={<ChatWindow />} />
          </Route>
        </Route>

        {/* 🔓 Public auth routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
