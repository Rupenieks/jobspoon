import React, { useMemo } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import Matches from "./components/Matches";
import Layout from "./components/Layout";
import LoginScreen from "./components/LoginScreen";
import ResumeDetails from "./components/ResumeDetails";
import ResumeList from "./components/ResumeList";
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
          <Route path="/resumes" element={<Resumes />}>
            <Route index element={<ResumeList />} />
            <Route path=":resumeId" element={<ResumeDetails />} />
          </Route>
          <Route path="/matches" element={<Matches />} />
          <Route path="*" element={<Navigate to="/resumes" replace />} />
        </Routes>
      </Layout>
    ) : (
      <LoginScreen />
    );
  }, [loading, isAuthenticated]);

  return <Router>{content}</Router>;
};

export default App;
