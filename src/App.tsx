import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import SignInPage from "./app/sign-in/page";
import SignUpPage from "./app/sign-up/page";
import ProfilePage from "./app/profile/page";
import DashboardPage from "./app/dashboard/page";
import NewThreadPage from "./app/new-thread/page";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/new-thread" element={<NewThreadPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
