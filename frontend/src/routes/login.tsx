import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async (m: string, p: string) => {
    setError("");
    setLoading(true);
    try {
      const u = await login(m, p);
      onSuccess();
      navigate({ to: u.role === "candidat" ? "/ma-fiche" : "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doLogin(matricule, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="matricule">Matricule</Label>
        <Input
          id="matricule"
          placeholder="ex. 20INGE0421"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Matricule non reconnu ? Contactez la scolarité.
      </p>

      <div className="border-t border-border pt-4">
        <p className="mb-3 text-center text-xs text-muted-foreground">
          Accès rapide (développement)
        </p>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => doLogin("20INGE0421", "pass")}
          >
            Étudiant — Aïcha Bamba
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => doLogin("PROFMBELLA", "pass")}
          >
            Enseignant — Pr. Jean-Paul Mbella
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => doLogin("PROFONDO", "pass")}
          >
            Super admin — Pr. Marie Ondo
          </Button>
        </div>
      </div>
    </form>
  );
}

function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate({ to: "/dashboard" });
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex flex-col justify-between bg-primary px-6 py-10 text-primary-foreground lg:w-2/5 lg:p-10">
        <img src="/logo_white.png" alt="PV Cloud" className="h-auto w-32 lg:w-40" />
        <div className="hidden lg:block">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            Plateforme interne
            <br /> des soutenances
          </h2>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
            Consultez et gérez les fiches de notation de soutenance de mémoire en toute confidentialité.
          </p>
        </div>
        <div className="text-[11px] text-primary-foreground/70">
          Accès réservé — données confidentielles
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10 lg:px-10">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center lg:hidden">
              <img src="/logo_blue.png" alt="PV Cloud" className="h-auto w-32" />
            </div>
            <CardTitle className="font-display text-xl">Connexion</CardTitle>
            <CardDescription>Accédez à votre espace personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={() => {}} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
