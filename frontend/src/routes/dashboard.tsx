import { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Search, ScanLine, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { MOCK_FICHES, type Fiche, type Mention } from "@/lib/mock-data";
import { BrandMark, Badge } from "@/components/mockup/shared";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const MENTION_TONE: Record<Mention, "solid" | "soft" | "default"> = {
  Excellent: "solid",
  "Très Bien": "solid",
  Bien: "soft",
  "Assez Bien": "default",
  Passable: "default",
};

function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [annee, setAnnee] = useState("");
  const [salle, setSalle] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  if (!isAuthenticated || !user) {
    navigate({ to: "/login" });
    return null;
  }

  if (user.role === "candidat") {
    navigate({ to: "/ma-fiche" });
    return null;
  }

  const filtered = useMemo(() => {
    return MOCK_FICHES.filter((f) => {
      if (annee && !f.date.includes(annee)) return false;
      if (salle && f.salle !== salle) return false;
      if (date && f.date !== date) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !f.candidat.toLowerCase().includes(q) &&
          !f.matricule.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [annee, salle, date, search]);

  const annees = useMemo(() => [...new Set(MOCK_FICHES.map((f) => f.date.slice(-4)))], []);
  const salles = useMemo(() => [...new Set(MOCK_FICHES.map((f) => f.salle))], []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
          <Link to="/dashboard">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-3">
            {user.role === "super-admin" && (
              <button
                onClick={() => navigate({ to: "/scan" })}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <ScanLine className="h-4 w-4" />
                <span className="hidden lg:inline">Scanner une fiche</span>
              </button>
            )}
            {user.role === "candidat" && (
              <Link
                to="/ma-fiche"
                className="hidden text-sm text-muted-foreground hover:text-foreground lg:block"
              >
                Ma fiche
              </Link>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Déconnexion</span>
            </button>
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
                {user.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="hidden text-xs leading-tight lg:block">
                <div className="font-medium text-foreground">{user.nom}</div>
                <div className="text-muted-foreground">{user.role}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold text-foreground lg:text-2xl">
            Bienvenue, {user.nom}
          </h1>
          <p className="text-sm text-muted-foreground">
            Consultez et filtrez les fiches de soutenance enregistrées.
          </p>
        </div>

        <div className="mb-6 rounded-lg border border-border bg-white p-4">
          <div className="mb-3 hidden items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:flex">
            <Search className="h-3.5 w-3.5" />
            Filtres
          </div>
          <div className="space-y-3 lg:flex lg:items-end lg:gap-3 lg:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground lg:hidden" />
              <input
                placeholder="Rechercher un candidat"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-border bg-white py-2 pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none lg:pl-3"
              />
            </div>
            <select
              value={annee}
              onChange={(e) => setAnnee(e.target.value)}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm lg:w-auto"
            >
              <option value="">Année</option>
              {annees.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select
              value={salle}
              onChange={(e) => setSalle(e.target.value)}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm lg:w-auto"
            >
              <option value="">Salle</option>
              {salles.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Date (jj/mm/aaaa)"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm lg:w-auto"
            />
            <button
              onClick={() => { setAnnee(""); setSalle(""); setDate(""); setSearch(""); }}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground lg:w-auto"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-lg border border-border bg-white lg:block">
          <table className="w-full text-sm">
            <thead className="bg-primary-soft/60 text-left text-xs uppercase tracking-wider text-primary-soft-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Nom du candidat</th>
                <th className="px-4 py-3 font-semibold">Matricule</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Salle</th>
                <th className="px-4 py-3 font-semibold">Mention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-foreground">{f.candidat}</td>
                  <td className="px-4 py-3 font-medium text-primary">{f.matricule}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.salle}</td>
                  <td className="px-4 py-3">
                    <Badge tone={MENTION_TONE[f.mention]}>{f.mention}</Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Aucune fiche trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {filtered.map((f) => (
            <div key={f.id} className="rounded-lg border border-border bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-foreground">{f.candidat}</div>
                  <div className="text-xs text-muted-foreground">{f.matricule}</div>
                </div>
                <Badge tone={MENTION_TONE[f.mention]}>{f.mention}</Badge>
              </div>
              <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
                <span>{f.date}</span>
                <span>Salle {f.salle}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune fiche trouvée.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
