import type { Fiche } from "@/lib/mock-data";

// Base de l'API versionnée du backend Django/DRF.
// Le point d'entrée peut être surchargé par une variable d'environnement.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export type ApiUser = {
  role: string;
  matricule: string;
  full_name?: string;
};

// Le backend et le front n'utilisent pas exactement les mêmes libellés de rôle.
// On normalise ici les valeurs backend vers le vocabulaire UI déjà utilisé par l'application.
function normalizeRole(role: string): "candidat" | "enseignant" | "chef-departement" | "super-admin" {
  switch (role) {
    case "student":
      return "candidat";
    case "chef_departement":
      return "chef-departement";
    case "super_admin":
      return "super-admin";
    default:
      return "enseignant";
  }
}

// Le JWT est décodé côté navigateur pour récupérer le rôle et le matricule
// sans dépendre d'un stockage local supplémentaire dans l'état React.
export function decodeJwtPayload(token: string): ApiUser | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload)) as ApiUser;
  } catch {
    return null;
  }
}

// Connexion à l'API backend : on envoie le matricule et le mot de passe,
// puis on renvoie un objet de session réutilisable par le provider d'authentification.
export async function apiLogin(matricule: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ matricule, password }),
  });

  if (!response.ok) {
    throw new Error("Impossible de se connecter à l’API backend");
  }

  const data = await response.json();
  const accessToken = data.access as string | undefined;
  const payload = accessToken ? decodeJwtPayload(accessToken) : null;

  if (!payload) {
    throw new Error("Réponse JWT invalide du backend");
  }

  return {
    accessToken,
    user: {
      matricule: payload.matricule ?? matricule,
      nom: payload.full_name ?? payload.matricule ?? matricule,
      role: normalizeRole(payload.role ?? "student"),
    },
  };
}

// Chargement des fiches métier depuis l'API. En cas d'absence de token,
// on laisse le composant gérer son fallback local vers les mocks de démo.
export async function apiFetchFiches(accessToken?: string): Promise<Fiche[]> {
  const response = await fetch(`${API_BASE}/fiches/`, {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les fiches depuis le backend");
  }

  const data = await response.json();
  const items = Array.isArray(data) ? data : data.results ?? [];

  return items.map((item: any) => ({
    id: String(item.id),
    candidat: `${item.candidat?.first_name ?? ""} ${item.candidat?.last_name ?? ""}`.trim(),
    matricule: item.candidat?.matricule ?? "",
    sujet: item.sujet ?? "",
    date: item.date ?? "",
    salle: item.salle ?? "",
    heure: item.heure ?? "",
    note: item.note ?? 0,
    mention: item.mention ?? "Passable",
    jury: (item.jury ?? []).map((member: any) => ({
      role: member.role ?? "",
      nom: member.name ?? "",
    })),
  }));
}
