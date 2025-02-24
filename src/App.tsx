
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UploadLeads from "@/pages/UploadLeads";
import MyLeads from "@/pages/MyLeads";
import Transactions from "@/pages/Transactions";
import CreateAccount from "@/pages/CreateAccount";
import Index from "@/pages/Index";
import SellerConfirmation from "@/pages/SellerConfirmation";
import InscriptionConfirmation from "@/pages/InscriptionConfirmation";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/inscrit-vendeur" element={<SellerConfirmation />} />
        <Route path="/confirmation-inscription" element={<InscriptionConfirmation />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-leads"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyLeads />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-leads"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UploadLeads />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Transactions />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
