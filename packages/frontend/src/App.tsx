import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";
import { useAuth } from "./auth/AuthProvider";
import Layout from "./components/Layout";
import Jobs from "./components/Jobs";
import Resumes from "./components/Resumes";

const App: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();

  const content = useMemo(() => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return isAuthenticated ? (
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </Layout>
    ) : (
      <LoginScreen />
    );
  }, [loading, isAuthenticated]);

  return <Router>{content}</Router>;
};

export default App;
