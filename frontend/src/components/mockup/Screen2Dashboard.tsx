import { Search, ScanLine, Filter, Bell } from "lucide-react";
import { BrandMark, Badge } from "./shared";

const rows = [
  { nom: "Aïcha Bamba", mat: "20INGE0421", date: "12/07/2026", salle: "A-201", mention: "Très Bien" },
  { nom: "Éric Nguema", mat: "20INGE0387", date: "12/07/2026", salle: "A-201", mention: "Bien" },
  { nom: "Sarah Diallo", mat: "20INGE0412", date: "12/07/2026", salle: "B-104", mention: "Excellent" },
  { nom: "Kwame Boateng", mat: "20INGE0356", date: "11/07/2026", salle: "A-201", mention: "Assez Bien" },
  { nom: "Lina Kaboré", mat: "20INGE0402", date: "11/07/2026", salle: "B-104", mention: "Bien" },
  { nom: "Yannick Owona", mat: "20INGE0399", date: "10/07/2026", salle: "C-002", mention: "Très Bien" },
];

const mentionTone = (m: string) =>
  m === "Excellent" || m === "Très Bien" ? "solid" : m === "Bien" ? "soft" : "default";

export const Screen2Mobile = () => (
  <div className="flex h-full min-h-[720px] flex-col bg-slate-50">
    <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
      <BrandMark compact />
      <button className="rounded-md bg-primary p-2 text-primary-foreground">
        <ScanLine className="h-4 w-4" />
      </button>
    </header>

    <div className="border-b border-border bg-white px-4 py-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Bienvenue
      </div>
      <div className="font-display text-lg font-semibold text-foreground">
        Pr. Marie Ondo
      </div>
      <Badge tone="soft">Super administrateur</Badge>
    </div>

    <div className="space-y-2 border-b border-border bg-white px-4 py-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Rechercher un candidat"
          className="w-full rounded-md border border-border bg-white py-2 pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <select className="rounded-md border border-border bg-white px-2 py-1.5 text-xs text-foreground">
          <option>Année</option>
          <option>2026</option>
        </select>
        <select className="rounded-md border border-border bg-white px-2 py-1.5 text-xs text-foreground">
          <option>Salle</option>
        </select>
        <select className="rounded-md border border-border bg-white px-2 py-1.5 text-xs text-foreground">
          <option>Date</option>
        </select>
      </div>
    </div>

    <div className="flex-1 space-y-2 overflow-hidden px-4 py-3">
      {rows.slice(0, 5).map((r) => (
        <div
          key={r.mat}
          className="rounded-lg border border-border bg-white p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-foreground">{r.nom}</div>
              <div className="text-xs text-muted-foreground">{r.mat}</div>
            </div>
            <Badge tone={mentionTone(r.mention)}>{r.mention}</Badge>
          </div>
          <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
            <span>{r.date}</span>
            <span>Salle {r.salle}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Screen2Desktop = () => (
  <div className="flex min-h-[560px] flex-col bg-slate-50">
    <header className="flex items-center justify-between border-b border-border bg-white px-8 py-4">
      <BrandMark />
      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <ScanLine className="h-4 w-4" />
          Scanner une fiche
        </button>
        <button className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
            MO
          </div>
          <div className="text-xs leading-tight">
            <div className="font-medium text-foreground">Pr. Marie Ondo</div>
            <div className="text-muted-foreground">Super administrateur</div>
          </div>
        </div>
      </div>
    </header>

    <div className="px-8 pt-6">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Bienvenue, Pr. Marie Ondo
      </h1>
      <p className="text-sm text-muted-foreground">
        Consultez et filtrez les fiches de soutenance enregistrées.
      </p>
    </div>

    <div className="px-8 py-6">
      <div className="rounded-lg border border-border bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          Filtres
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/80">Année</label>
            <select className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm">
              <option>Toutes</option>
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/80">Salle</label>
            <select className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm">
              <option>Toutes</option>
              <option>A-201</option>
              <option>B-104</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/80">Date</label>
            <input type="text" placeholder="jj/mm/aaaa" className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm" />
          </div>
          <div className="flex items-end">
            <button className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Rechercher
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="px-8 pb-8">
      <div className="overflow-hidden rounded-lg border border-border bg-white">
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
            {rows.map((r) => (
              <tr key={r.mat} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-foreground">{r.nom}</td>
                <td className="px-4 py-3 font-medium text-primary">{r.mat}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.salle}</td>
                <td className="px-4 py-3">
                  <Badge tone={mentionTone(r.mention)}>{r.mention}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
