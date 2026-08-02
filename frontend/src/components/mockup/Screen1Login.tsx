import { BrandMark, Field } from "./shared";

function LoginCard({ dense = false }: { dense?: boolean }) {
  return (
    <div className={`mx-auto w-full ${dense ? "max-w-xs" : "max-w-sm"}`}>
      <div className="mb-6 flex justify-center">
        <BrandMark />
      </div>
      <h1 className="text-center font-display text-xl font-semibold text-foreground">
        Connexion
      </h1>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        Accédez à votre espace personnel
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Matricule">
          <input
            type="text"
            placeholder="ex. 20INGE0421"
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </Field>
        <Field label="Mot de passe">
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </Field>
        <button className="w-full rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Se connecter
        </button>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        Matricule non reconnu&nbsp;? Contactez la scolarité.
      </p>
    </div>
  );
}

export const Screen1Mobile = () => (
  <div className="flex h-full min-h-[720px] flex-col justify-center bg-slate-50 px-6 py-10">
    <LoginCard dense />
  </div>
);

export const Screen1Desktop = () => (
  <div className="grid min-h-[560px] grid-cols-2 bg-white">
    <div className="flex flex-col justify-between bg-primary p-10 text-primary-foreground">
      <BrandMark compact />
      <div>
        <h2 className="font-display text-3xl font-semibold leading-tight">
          Plateforme interne
          <br /> des soutenances
        </h2>
        <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
          Consultez et gérez les fiches de notation de soutenance de mémoire en
          toute confidentialité.
        </p>
      </div>
      <div className="text-[11px] text-primary-foreground/70">
        Accès réservé — données confidentielles
      </div>
    </div>
    <div className="flex items-center justify-center bg-slate-50 p-10">
      <LoginCard />
    </div>
  </div>
);
