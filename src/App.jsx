import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
import ProjectDetails from "./components/ProjectDetails";
import FavoriteProjectsPage from "./components/FavoriteProjectsPage";

import "./styles/app.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState(null);

  const handleLoginSuccess = (userId) => {
    setIsLoggedIn(true);
    setCurrentUserId(userId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserId(null);
  };

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <HeaderLogado onLogout={handleLogout} currentUserId={currentUserId} />
      ) : (
        <Header />
      )}
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
              onLoginSuccess={handleLoginSuccess} // <--- onLoginSuccess AGORA ESPERA UM userId
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="/signup"
          element={<SignUpPage isLoggedIn={isLoggedIn} />}
        />
        <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} />} />
        <Route path="/project/:projectId" element={<ProjectDetails />} />
        <Route path="/favorite-projects" element={<FavoriteProjectsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
