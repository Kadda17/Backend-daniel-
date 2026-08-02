import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar, MapPin, Clock, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { MOCK_FICHES, type Fiche } from "@/lib/mock-data";
import { BrandMark, Badge } from "@/components/mockup/shared";

export const Route = createFileRoute("/ma-fiche")({
  component: MaFichePage,
});

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-md bg-primary-soft text-primary-soft-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

function JuryMember({ role, name }: { role: string; name: string }) {
  return (
    <div className="rounded-md border border-border bg-white p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{role}</div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{name}</div>
    </div>
  );
}

function MaFichePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    navigate({ to: "/login" });
    return null;
  }

  if (user.role !== "candidat") {
    navigate({ to: "/dashboard" });
    return null;
  }

  const fiche: Fiche | undefined =
    MOCK_FICHES.find((f) => f.matricule === user.matricule);

  if (!fiche) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-muted-foreground">Aucune fiche trouvée.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
          <BrandMark />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
              {user.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="hidden text-xs leading-tight lg:block">
              <div className="font-medium text-foreground">{user.nom}</div>
              <div className="text-muted-foreground">{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Ma fiche de soutenance
          </div>
          <h1 className="mt-1 font-display text-xl font-semibold text-foreground lg:text-2xl">
            {fiche.candidat}
          </h1>
          <div className="text-sm text-muted-foreground">
            Matricule : <span className="font-medium text-foreground">{fiche.matricule}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-lg border border-border bg-white p-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Sujet du mémoire
              </div>
              <div className="mt-1 text-base font-semibold leading-snug text-foreground">
                {fiche.sujet}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <InfoRow icon={Calendar} label="Date" value={fiche.date} />
                <InfoRow icon={MapPin} label="Salle" value={fiche.salle} />
                <InfoRow icon={Clock} label="Heure" value={fiche.heure} />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-white p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Composition du jury
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {fiche.jury.map((m, i) => (
                  <JuryMember key={i} role={m.role} name={m.nom} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary p-6 text-primary-foreground">
              <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">
                Mention obtenue
              </div>
              <div className="mt-2 font-display text-3xl font-semibold">{fiche.mention}</div>
              <div className="mt-1 text-sm text-primary-foreground/80">Note : {fiche.note} / 20</div>
              <div className="mt-4 border-t border-primary-foreground/20 pt-3 text-[11px] text-primary-foreground/70">
                Fiche validée par la scolarité
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Statut</div>
              <div className="mt-1">
                <Badge tone="soft">Soutenance validée</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
