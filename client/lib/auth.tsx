import { createContext, useContext, useMemo, useState } from "react";

const SESSION_KEY = "movement_ai_session";
const USERNAME = "stc.demo";
const PASSWORD = "COW@2026";

type AuthContextValue = {
  authenticated: boolean;
  username: string;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState(() => sessionStorage.getItem(SESSION_KEY) || "");
  const value = useMemo<AuthContextValue>(
    () => ({
      authenticated: Boolean(username),
      username,
      signIn: (candidate, password) => {
        if (candidate.trim().toLowerCase() !== USERNAME || password !== PASSWORD) return false;
        sessionStorage.setItem(SESSION_KEY, USERNAME);
        setUsername(USERNAME);
        return true;
      },
      signOut: () => {
        sessionStorage.removeItem(SESSION_KEY);
        setUsername("");
      },
    }),
    [username],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
