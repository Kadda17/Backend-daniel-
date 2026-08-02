import { Camera, Upload, FileImage, ImagePlus } from "lucide-react";
import { BrandMark } from "./shared";

export const Screen4Mobile = () => (
  <div className="flex h-full min-h-[720px] flex-col bg-slate-50">
    <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
      <BrandMark compact />
      <div className="text-xs text-muted-foreground">Admin</div>
    </header>

    <div className="flex flex-1 flex-col px-6 py-8">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Étape 1 sur 2
        </div>
        <h1 className="mt-1 font-display text-xl font-semibold text-foreground">
          Scanner une fiche
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prenez en photo la fiche papier pour l'ajouter à la base.
        </p>
      </div>

      <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-6">
        <button className="flex h-40 w-40 flex-col items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95">
          <Camera className="h-14 w-14" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Prendre une photo
          </span>
        </button>
        <p className="max-w-[220px] text-center text-xs text-muted-foreground">
          Cadrez la fiche entière dans le viseur, en évitant les reflets.
        </p>
      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-3 text-sm font-medium text-foreground">
        <ImagePlus className="h-4 w-4" />
        Choisir depuis la galerie
      </button>
    </div>
  </div>
);

export const Screen4Desktop = () => (
  <div className="flex min-h-[560px] flex-col bg-slate-50">
    <header className="flex items-center justify-between border-b border-border bg-white px-8 py-4">
      <BrandMark />
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
          MO
        </div>
        <div className="text-xs leading-tight">
          <div className="font-medium text-foreground">Pr. Marie Ondo</div>
          <div className="text-muted-foreground">Super administrateur</div>
        </div>
      </div>
    </header>

    <div className="px-8 py-6">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Étape 1 sur 2
      </div>
      <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">
        Importer une fiche scannée
      </h1>
      <p className="text-sm text-muted-foreground">
        Chargez une image ou un scan de la fiche depuis votre ordinateur.
      </p>
    </div>

    <div className="px-8 pb-8">
      <div className="rounded-lg border-2 border-dashed border-primary/30 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-soft-foreground">
          <Upload className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <div className="mt-4 font-display text-lg font-semibold text-foreground">
          Glissez-déposez votre fichier ici
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          ou cliquez pour parcourir vos fichiers (PNG, JPG, PDF — max 10 Mo)
        </div>
        <button className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <FileImage className="h-4 w-4" />
          Importer un fichier
        </button>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-md border border-border bg-white p-4 text-xs text-muted-foreground">
        <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
        <div>
          Astuce&nbsp;: privilégiez un scan à plat, bien éclairé et sans ombre
          pour améliorer la précision de l'extraction automatique.
        </div>
      </div>
    </div>
  </div>
);
