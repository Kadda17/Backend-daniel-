import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { FileImage, Check, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Field } from "@/components/mockup/shared";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/validation")({
  component: ValidationPage,
});

const inputCls =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

function ValidationPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    navigate({ to: "/login" });
    return null;
  }

  if (user.role !== "super-admin") {
    navigate({ to: "/dashboard" });
    return null;
  }

  const [nom, setNom] = useState("Aïcha Bamba");
  const [matricule, setMatricule] = useState("20INGE0421");
  const [sujet, setSujet] = useState(
    "Optimisation énergétique des micro-réseaux solaires en zone rurale"
  );
  const [date, setDate] = useState("12/07/2026");
  const [salle, setSalle] = useState("A-201");
  const [heure, setHeure] = useState("10h30");
  const [note, setNote] = useState("17.5");
  const [mention, setMention] = useState("Très Bien");
  const [encadreur, setEncadreur] = useState("Pr. Marie Ondo");
  const [president, setPresident] = useState("Pr. Jean-Paul Mbella");
  const [examinateur, setExaminateur] = useState("Dr. Sophie Nkoulou");
  const [encadreurPro, setEncadreurPro] = useState("Ing. Paul Fongang");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 1500);
  };

  if (saved) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
            Fiche enregistrée
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Redirection vers le tableau de bord...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex items-center gap-3">
            <Link to="/scan" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden lg:inline">Retour au scan</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Tableau de bord
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/scan" })}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4" />
              Enregistrer
            </Button>
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
                {user.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="hidden text-xs leading-tight lg:block">
                <div className="font-medium text-foreground">{user.nom}</div>
                <div className="text-muted-foreground">Super administrateur</div>
              </div>
              <button
                onClick={logout}
                className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Étape 2 sur 2
          </div>
          <h1 className="mt-1 font-display text-xl font-semibold text-foreground lg:text-2xl">
            Valider les données extraites
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vérifiez et corrigez si nécessaire avant l'enregistrement.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Fiche scannée
              </div>
              <div className="text-[11px] text-muted-foreground">Original</div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-slate-500 min-h-[420px]">
              <FileImage className="h-10 w-10" strokeWidth={1.25} />
              <div className="mt-2 text-xs font-medium">fiche-scan-20260712.jpg</div>
              <div className="text-[11px] text-slate-400">Aperçu de la fiche</div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Données extraites
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary-soft-foreground">
                <Check className="h-3 w-3" /> Auto-remplies
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nom du candidat">
                  <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} />
                </Field>
                <Field label="Matricule">
                  <input className={inputCls} value={matricule} onChange={(e) => setMatricule(e.target.value)} />
                </Field>
              </div>
              <Field label="Sujet du mémoire">
                <input className={inputCls} value={sujet} onChange={(e) => setSujet(e.target.value)} />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Date">
                  <input className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
                <Field label="Salle">
                  <input className={inputCls} value={salle} onChange={(e) => setSalle(e.target.value)} />
                </Field>
                <Field label="Heure">
                  <input className={inputCls} value={heure} onChange={(e) => setHeure(e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Note (/20)">
                  <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} />
                </Field>
                <Field label="Mention">
                  <select className={inputCls} value={mention} onChange={(e) => setMention(e.target.value)}>
                    <option>Excellent</option>
                    <option>Très Bien</option>
                    <option>Bien</option>
                    <option>Assez Bien</option>
                  </select>
                </Field>
              </div>
              <div className="rounded-md border border-border bg-slate-50/60 p-3">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Membres du jury
                </div>
                <div className="space-y-2">
                  <Field label="Encadreur académique">
                    <input className={inputCls} value={encadreur} onChange={(e) => setEncadreur(e.target.value)} />
                  </Field>
                  <Field label="Président du jury">
                    <input className={inputCls} value={president} onChange={(e) => setPresident(e.target.value)} />
                  </Field>
                  <Field label="Examinateur">
                    <input className={inputCls} value={examinateur} onChange={(e) => setExaminateur(e.target.value)} />
                  </Field>
                  <Field label="Encadreur professionnel (invité)">
                    <input className={inputCls} value={encadreurPro} onChange={(e) => setEncadreurPro(e.target.value)} />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
