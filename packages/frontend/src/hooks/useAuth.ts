import { useState, useCallback } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log("Is Authenticated", isAuthenticated);

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        credentials
      );
      localStorage.setItem("token", response.data.access_token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Failed to sign in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (credentials: AuthCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        credentials
      );
      localStorage.setItem("token", response.data.access_token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Failed to sign up");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async (credential: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/auth/google", {
        credential,
      });

      console.log(response.data);
      localStorage.setItem("token", response.data.access_token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError("Failed to sign out");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
};
