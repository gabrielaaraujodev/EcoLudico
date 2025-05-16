import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HeaderLogado from "./components/HeaderLogado";
import IdeaSection from "./components/IdeaSection";
import FeaturesSection from "./components/FeaturesSection";
import RewardsSection from "./components/RewardsSection";
import ProcedureSection from "./components/ProcedureSection";
import Footer from "./components/Footer";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import Profile from "./components/Profile";

import "./styles/app.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      {isLoggedIn ? <HeaderLogado onLogout={handleLogout} /> : <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <IdeaSection />
              <FeaturesSection />
              <RewardsSection />
              <ProcedureSection />
              <Footer />
            </>
          }
        />
        <Route
          path="/signin"
          element={
            <SignInPage
              onLoginSuccess={handleLoginSuccess}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="/signup"
          element={<SignUpPage isLoggedIn={isLoggedIn} />}
        />
        <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
