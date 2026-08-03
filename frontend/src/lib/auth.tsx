import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { apiLogin } from "@/lib/api";

export type UserRole = "candidat" | "enseignant" | "chef-departement" | "super-admin";

export type User = {
  matricule: string;
  nom: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (matricule: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "20INGE0421": { password: "pass", user: { matricule: "20INGE0421", nom: "Aïcha Bamba", role: "candidat" } },
  "PROFONDO": { password: "pass", user: { matricule: "PROFONDO", nom: "Pr. Marie Ondo", role: "super-admin" } },
  "PROFMBELLA": { password: "pass", user: { matricule: "PROFMBELLA", nom: "Pr. Jean-Paul Mbella", role: "enseignant" } },
  "CHEFDEPT": { password: "pass", user: { matricule: "CHEFDEPT", nom: "Dr. Robert Tchinda", role: "chef-departement" } },
};

// Clés de stockage utilisées pour mémoriser la session utilisateur et le JWT.
const localStorageKey = "pv-cloud-user";
const accessTokenKey = "pv-cloud-access-token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Le provider essaie d'abord le backend réel.
  // Si l'API n'est pas disponible, il revêt un comportement de secours
  // compatible avec la démo existante pour ne pas bloquer l'expérience.
  const login = useCallback(async (matricule: string, password: string) => {
    try {
      const backendResponse = await apiLogin(matricule, password);
      setUser(backendResponse.user);
      localStorage.setItem(localStorageKey, JSON.stringify(backendResponse.user));
      if (backendResponse.accessToken) {
        localStorage.setItem(accessTokenKey, backendResponse.accessToken);
      }
      return backendResponse.user;
    } catch {
      const entry = MOCK_USERS[matricule];
      if (!entry || entry.password !== password) {
        throw new Error("Matricule ou mot de passe incorrect");
      }
      setUser(entry.user);
      localStorage.setItem(localStorageKey, JSON.stringify(entry.user));
      return entry.user;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(localStorageKey);
    localStorage.removeItem(accessTokenKey);
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
