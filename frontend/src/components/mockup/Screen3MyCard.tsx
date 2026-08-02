import { Calendar, MapPin, Clock, User } from "lucide-react";
import { BrandMark, Badge } from "./shared";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-md bg-primary-soft text-primary-soft-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

function JuryMember({ role, name }: { role: string; name: string }) {
  return (
    <div className="rounded-md border border-border bg-white p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {role}
      </div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{name}</div>
    </div>
  );
}

export const Screen3Mobile = () => (
  <div className="flex h-full min-h-[720px] flex-col bg-slate-50">
    <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
      <BrandMark compact />
      <div className="text-xs text-muted-foreground">Étudiant</div>
    </header>

    <div className="space-y-4 p-4">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Ma fiche de soutenance
        </div>
        <h1 className="mt-1 font-display text-lg font-semibold text-foreground">
          Aïcha Bamba
        </h1>
        <div className="text-xs text-muted-foreground">20INGE0421</div>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary p-4 text-primary-foreground">
        <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">
          Mention obtenue
        </div>
        <div className="mt-1 font-display text-2xl font-semibold">Très Bien</div>
        <div className="mt-1 text-sm text-primary-foreground/80">Note : 17.5 / 20</div>
      </div>

      <div className="rounded-lg border border-border bg-white p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Sujet du mémoire
        </div>
        <div className="mt-1 text-sm font-medium leading-snug text-foreground">
          Optimisation énergétique des micro-réseaux solaires en zone rurale
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-white p-4">
        <InfoRow icon={Calendar} label="Date" value="12/07/2026" />
        <InfoRow icon={MapPin} label="Salle" value="A-201" />
        <InfoRow icon={Clock} label="Heure" value="10h30" />
      </div>

      <div className="space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Jury
        </div>
        <JuryMember role="Encadreur académique" name="Pr. Marie Ondo" />
        <JuryMember role="Président du jury" name="Pr. Jean-Paul Mbella" />
        <JuryMember role="Examinateur" name="Dr. Sophie Nkoulou" />
        <JuryMember role="Encadreur professionnel (invité)" name="Ing. Paul Fongang" />
      </div>
    </div>
  </div>
);

export const Screen3Desktop = () => (
  <div className="flex min-h-[560px] flex-col bg-slate-50">
    <header className="flex items-center justify-between border-b border-border bg-white px-8 py-4">
      <BrandMark />
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
          AB
        </div>
        <div className="text-xs leading-tight">
          <div className="font-medium text-foreground">Aïcha Bamba</div>
          <div className="text-muted-foreground">Étudiante</div>
        </div>
      </div>
    </header>

    <div className="px-8 py-6">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Ma fiche de soutenance
      </div>
      <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">
        Aïcha Bamba
      </h1>
      <div className="text-sm text-muted-foreground">
        Matricule&nbsp;: <span className="font-medium text-foreground">20INGE0421</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6 px-8 pb-8">
      <div className="col-span-2 space-y-4">
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Sujet du mémoire
          </div>
          <div className="mt-1 text-base font-semibold leading-snug text-foreground">
            Optimisation énergétique des micro-réseaux solaires en zone rurale
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <InfoRow icon={Calendar} label="Date" value="12/07/2026" />
            <InfoRow icon={MapPin} label="Salle" value="A-201" />
            <InfoRow icon={Clock} label="Heure" value="10h30" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <User className="h-3.5 w-3.5" /> Composition du jury
          </div>
          <div className="grid grid-cols-2 gap-3">
            <JuryMember role="Encadreur académique" name="Pr. Marie Ondo" />
            <JuryMember role="Président du jury" name="Pr. Jean-Paul Mbella" />
            <JuryMember role="Examinateur" name="Dr. Sophie Nkoulou" />
            <JuryMember role="Encadreur professionnel (invité)" name="Ing. Paul Fongang" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-primary/20 bg-primary p-6 text-primary-foreground">
          <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">
            Mention obtenue
          </div>
          <div className="mt-2 font-display text-3xl font-semibold">Très Bien</div>
          <div className="mt-1 text-sm text-primary-foreground/80">Note : 17.5 / 20</div>
          <div className="mt-4 border-t border-primary-foreground/20 pt-3 text-[11px] text-primary-foreground/70">
            Fiche validée par la scolarité
          </div>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Statut
          </div>
          <div className="mt-1">
            <Badge tone="soft">Soutenance validée</Badge>
          </div>
        </div>
      </div>
    </div>
  </div>
);
