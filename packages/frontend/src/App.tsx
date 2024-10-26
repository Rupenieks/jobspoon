import React, { useMemo } from "react";
import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const { user, loading } = useAuth();

  const content = useMemo(() => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return user ? <Dashboard /> : <LoginScreen />;
  }, [user, loading]);

  return content;
};

export default App;
