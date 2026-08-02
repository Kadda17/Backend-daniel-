import { useState, useRef } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Camera, Upload, FileImage, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/scan")({
  component: ScanPage,
});

function ScanPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    navigate({ to: "/login" });
    return null;
  }

  if (user.role !== "super-admin") {
    navigate({ to: "/dashboard" });
    return null;
  }

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    // For now, navigate to validation with the file data in state
    navigate({ to: "/validation", state: { file: preview } });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden lg:inline">Retour au tableau de bord</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
              {user.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="text-xs leading-tight">
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
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Étape 1 sur 2
          </div>
          <h1 className="mt-1 font-display text-xl font-semibold text-foreground lg:text-2xl">
            Scanner une fiche
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Importez la fiche papier pour l'ajouter à la base.
          </p>
        </div>

        {!preview ? (
          <>
            <div className="lg:hidden">
              <div className="flex flex-col items-center gap-6 py-12">
                <button className="flex h-40 w-40 flex-col items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95">
                  <Camera className="h-14 w-14" strokeWidth={1.5} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Prendre une photo
                  </span>
                </button>
                <p className="max-w-[220px] text-center text-xs text-muted-foreground">
                  Cadrez la fiche entière dans le viseur, en évitant les reflets.
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-2"
                >
                  <FileImage className="h-4 w-4" />
                  Choisir depuis la galerie
                </Button>
              </div>
            </div>

            <div
              className="hidden rounded-lg border-2 border-dashed border-primary/30 bg-white p-12 text-center lg:block"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-soft-foreground">
                <Upload className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <div className="mt-4 font-display text-lg font-semibold text-foreground">
                Glissez-déposez votre fichier ici
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                ou cliquez pour parcourir vos fichiers (PNG, JPG, PDF — max 10 Mo)
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 inline-flex items-center gap-2"
              >
                <FileImage className="h-4 w-4" />
                Importer un fichier
              </Button>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-md border border-border bg-white p-4 text-xs text-muted-foreground">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
              <div>
                Astuce : privilégiez un scan à plat, bien éclairé et sans ombre
                pour améliorer la précision de l'extraction automatique.
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg border border-border bg-white">
              <img src={preview} alt="Aperçu" className="mx-auto max-h-[600px] object-contain" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-white p-4">
              <div className="text-sm">
                <span className="font-medium text-foreground">{selectedFile?.name}</span>
                <span className="ml-2 text-muted-foreground">
                  ({(selectedFile!.size / 1024).toFixed(0)} Ko)
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setSelectedFile(null); setPreview(null); }}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  Valider et extraire les données
                </Button>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
