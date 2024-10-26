import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";

const AuthContext = createContext<ReturnType<typeof useAuthHook> | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const auth = useAuthHook();

  useEffect(() => {
    auth.checkAuth();
  }, [auth]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
