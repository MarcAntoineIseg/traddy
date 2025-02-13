
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UploadLeads from "@/pages/UploadLeads";
import MyLeads from "@/pages/MyLeads";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/my-leads"
          element={
            <MainLayout>
              <MyLeads />
            </MainLayout>
          }
        />
        <Route
          path="/upload-leads"
          element={
            <MainLayout>
              <UploadLeads />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
