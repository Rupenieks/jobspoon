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

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/signin",
        credentials
      );
      setUser(response.data.user);
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
        "http://localhost:3000/auth/signup",
        credentials
      );
      setUser(response.data.user);
    } catch (err) {
      setError("Failed to sign up");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Implement Google Sign-In logic here
      // This will typically involve opening a popup window for Google authentication
      // and then sending the received token to your backend
      console.log("Google Sign-In not implemented yet");
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
      await axios.post("http://localhost:3000/auth/signout");
      setUser(null);
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
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
};
