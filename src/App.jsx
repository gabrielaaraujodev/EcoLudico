import React from "react";

import "./styles/app.css";

import Header from "./components/Header";
import IdeaSection from "./components/IdeaSection";
import FeaturesSection from "./components/FeaturesSection";
import RewardsSection from "./components/RewardsSection";
import ProcedureSection from "./components/ProcedureSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Header />
      <IdeaSection />
      <FeaturesSection />
      <RewardsSection />
      <ProcedureSection />
      <Footer />
    </div>
  );
}

export default App;
