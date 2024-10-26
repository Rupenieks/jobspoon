import React, { useMemo } from "react";
import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";
import { useAuth } from "./auth/AuthProvider";

const App: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();

  const content = useMemo(() => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return isAuthenticated ? <Dashboard /> : <LoginScreen />;
  }, [loading, isAuthenticated]);

  return content;
};

export default App;
