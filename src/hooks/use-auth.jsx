import { useState, useEffect, createContext, useContext } from "react";
import { useMutation } from "@tanstack/react-query";

// Create Auth Context
const AuthContext = createContext(null);

// Simulate API calls (Replace with actual API)
const fakeAuthAPI = {
  login: async ({ username, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "admin" && password === "password") {
          resolve({ token: "fake-jwt-token", username });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  },
  logout: async () => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const loginMutation = useMutation({
    mutationFn: fakeAuthAPI.login,
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    },
  });

  const logout = async () => {
    await fakeAuthAPI.logout();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginMutation, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
