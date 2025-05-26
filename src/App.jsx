import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/app.css";

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
import ProjectsPage from "./components/ProjectsPage";
import CollectionPoints from "./components/CollectionPoints";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const handleLoginSuccess = (userId) => {
    setIsLoggedIn(true);
    setCurrentUserId(userId);
    sessionStorage.setItem("userId", userId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserId(null);
    sessionStorage.removeItem("userId");
  };

  React.useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setIsLoggedIn(true);
      setCurrentUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

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
              onLoginSuccess={handleLoginSuccess}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="/signup"
          element={<SignUpPage isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/profile"
          element={
            <Profile isLoggedIn={isLoggedIn} currentUserId={currentUserId} />
          }
        />
        <Route
          path="/project/:projectId"
          element={<ProjectDetails currentUserId={currentUserId} />}
        />
        <Route
          path="/favorite-projects"
          element={<FavoriteProjectsPage currentUserId={currentUserId} />}
        />
        <Route
          path="/projetos"
          element={<ProjectsPage currentUserId={currentUserId} />}
        />

        <Route
          path="collection-points"
          element={<CollectionPoints currentUserId={currentUserId} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
