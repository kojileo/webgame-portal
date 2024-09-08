import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GameListPage from "./pages/GameListPage";
import GameDetailPage from "./pages/GameDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GameUploadPage from "./pages/GameUploadPage";
import DeveloperDashboardPage from "./pages/DeveloperDashboardPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GameListPage />} />
        <Route path="/games/:id" element={<GameDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/upload-game" element={<GameUploadPage />} />
        <Route
          path="/developer-dashboard"
          element={<DeveloperDashboardPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
