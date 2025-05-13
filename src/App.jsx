import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import IdeaSection from "./components/IdeaSection";
import FeaturesSection from "./components/FeaturesSection";
import RewardsSection from "./components/RewardsSection";
import ProcedureSection from "./components/ProcedureSection";
import Footer from "./components/Footer";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";

import "./styles/app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <IdeaSection />
              <FeaturesSection />
              <RewardsSection />
              <ProcedureSection />
              <Footer />
            </>
          }
        />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
