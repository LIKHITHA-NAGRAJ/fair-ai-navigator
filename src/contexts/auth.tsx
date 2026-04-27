import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = { email: string; name: string };
type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("fairmind_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async (email: string, _password: string) => {
    const u = { email, name: email.split("@")[0] };
    setUser(u);
    localStorage.setItem("fairmind_user", JSON.stringify(u));
  };
  const signup = async (name: string, email: string, _password: string) => {
    const u = { email, name };
    setUser(u);
    localStorage.setItem("fairmind_user", JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("fairmind_user");
  };

  return <Ctx.Provider value={{ user, login, signup, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}