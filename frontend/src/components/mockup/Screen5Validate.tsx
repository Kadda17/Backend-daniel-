import { FileImage, Check } from "lucide-react";
import { BrandMark, Field } from "./shared";

function Fiche({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border border-slate-300 bg-slate-100 ${
        small ? "h-56" : "h-full min-h-[420px]"
      } text-slate-500`}
    >
      <FileImage className="h-10 w-10" strokeWidth={1.25} />
      <div className="mt-2 text-xs font-medium">fiche-scan-20260712.jpg</div>
      <div className="text-[11px] text-slate-400">Aperçu de la fiche</div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

function Form({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`space-y-3 ${compact ? "" : ""}`}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nom du candidat">
          <input className={inputCls} defaultValue="Aïcha Bamba" />
        </Field>
        <Field label="Matricule">
          <input className={inputCls} defaultValue="20INGE0421" />
        </Field>
      </div>
      <Field label="Sujet du mémoire">
        <input
          className={inputCls}
          defaultValue="Optimisation énergétique des micro-réseaux solaires en zone rurale"
        />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Date">
          <input className={inputCls} defaultValue="12/07/2026" />
        </Field>
        <Field label="Salle">
          <input className={inputCls} defaultValue="A-201" />
        </Field>
        <Field label="Heure">
          <input className={inputCls} defaultValue="10h30" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Note (/20)">
          <input className={inputCls} defaultValue="17.5" />
        </Field>
        <Field label="Mention">
          <select className={inputCls} defaultValue="Très Bien">
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
            <input className={inputCls} defaultValue="Pr. Marie Ondo" />
          </Field>
          <Field label="Président du jury">
            <input className={inputCls} defaultValue="Pr. Jean-Paul Mbella" />
          </Field>
          <Field label="Examinateur">
            <input className={inputCls} defaultValue="Dr. Sophie Nkoulou" />
          </Field>
          <Field label="Encadreur professionnel (invité)">
            <input className={inputCls} defaultValue="Ing. Paul Fongang" />
          </Field>
        </div>
      </div>
    </div>
  );
}

export const Screen5Mobile = () => (
  <div className="flex h-full min-h-[720px] flex-col bg-slate-50">
    <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
      <BrandMark compact />
      <div className="text-xs text-muted-foreground">Étape 2/2</div>
    </header>

    <div className="space-y-4 p-4">
      <div>
        <h1 className="font-display text-lg font-semibold text-foreground">
          Valider les données extraites
        </h1>
        <p className="text-xs text-muted-foreground">
          Vérifiez et corrigez si nécessaire avant l'enregistrement.
        </p>
      </div>

      <Fiche small />

      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary-soft-foreground">
        <Check className="h-3 w-3" /> Données extraites automatiquement
      </div>

      <Form compact />

      <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
        Enregistrer dans la base de données
      </button>
    </div>
  </div>
);

export const Screen5Desktop = () => (
  <div className="flex min-h-[560px] flex-col bg-slate-50">
    <header className="flex items-center justify-between border-b border-border bg-white px-8 py-4">
      <BrandMark />
      <div className="flex items-center gap-3">
        <button className="rounded-md border border-border bg-white px-3.5 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
          Annuler
        </button>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Check className="h-4 w-4" />
          Enregistrer dans la base
        </button>
      </div>
    </header>

    <div className="px-8 py-6">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Étape 2 sur 2
      </div>
      <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">
        Valider les données extraites
      </h1>
      <p className="text-sm text-muted-foreground">
        Comparez la fiche originale et le formulaire pré-rempli. Chaque champ
        reste modifiable avant enregistrement.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-6 px-8 pb-8">
      <div className="rounded-lg border border-border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Fiche scannée
          </div>
          <div className="text-[11px] text-muted-foreground">Original</div>
        </div>
        <Fiche />
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
        <Form />
      </div>
    </div>
  </div>
);
