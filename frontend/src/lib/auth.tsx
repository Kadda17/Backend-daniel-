import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type UserRole = "candidat" | "enseignant" | "chef-departement" | "super-admin";

export type User = {
  matricule: string;
  nom: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (matricule: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "20INGE0421": { password: "pass", user: { matricule: "20INGE0421", nom: "Aïcha Bamba", role: "candidat" } },
  "PROFONDO": { password: "pass", user: { matricule: "PROFONDO", nom: "Pr. Marie Ondo", role: "super-admin" } },
  "PROFMBELLA": { password: "pass", user: { matricule: "PROFMBELLA", nom: "Pr. Jean-Paul Mbella", role: "enseignant" } },
  "CHEFDEPT": { password: "pass", user: { matricule: "CHEFDEPT", nom: "Dr. Robert Tchinda", role: "chef-departement" } },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pv-cloud-user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = useCallback(async (matricule: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const entry = MOCK_USERS[matricule];
    if (!entry || entry.password !== password) {
      throw new Error("Matricule ou mot de passe incorrect");
    }
    setUser(entry.user);
    localStorage.setItem("pv-cloud-user", JSON.stringify(entry.user));
    return entry.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("pv-cloud-user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
