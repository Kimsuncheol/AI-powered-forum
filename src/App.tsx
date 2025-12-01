import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import NewThreadPage from "./pages/NewThreadPage";
import InboxPage from "./pages/InboxPage";
import InboxDetailPage from "./pages/InboxDetailPage";
import ChatLayout from "./components/ChatLayout";
import ChatListPage from "./pages/ChatListPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/new-thread" element={<NewThreadPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/inbox/:id" element={<InboxDetailPage />} />
            <Route path="/chat" element={<ChatLayout />}>
              <Route index element={<ChatListPage />} />
              <Route path=":id" element={<ChatRoomPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
