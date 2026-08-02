export type Mention = "Excellent" | "Très Bien" | "Bien" | "Assez Bien" | "Passable";

export type JuryMember = {
  role: string;
  nom: string;
};

export type Fiche = {
  id: string;
  candidat: string;
  matricule: string;
  sujet: string;
  date: string;
  salle: string;
  heure: string;
  note: number;
  mention: Mention;
  jury: JuryMember[];
};

export const MOCK_FICHES: Fiche[] = [
  {
    id: "1",
    candidat: "Aïcha Bamba",
    matricule: "20INGE0421",
    sujet: "Optimisation énergétique des micro-réseaux solaires en zone rurale",
    date: "12/07/2026",
    salle: "A-201",
    heure: "10h30",
    note: 17.5,
    mention: "Très Bien",
    jury: [
      { role: "Encadreur académique", nom: "Pr. Marie Ondo" },
      { role: "Président du jury", nom: "Pr. Jean-Paul Mbella" },
      { role: "Examinateur", nom: "Dr. Sophie Nkoulou" },
      { role: "Encadreur professionnel (invité)", nom: "Ing. Paul Fongang" },
    ],
  },
  {
    id: "2",
    candidat: "Éric Nguema",
    matricule: "20INGE0387",
    sujet: "Conception d'un système de détection précoce des feux de brousse par IoT",
    date: "12/07/2026",
    salle: "A-201",
    heure: "14h00",
    note: 14.0,
    mention: "Bien",
    jury: [
      { role: "Encadreur académique", nom: "Pr. Jean-Paul Mbella" },
      { role: "Président du jury", nom: "Pr. Marie Ondo" },
      { role: "Examinateur", nom: "Dr. Alain Tchinda" },
    ],
  },
  {
    id: "3",
    candidat: "Sarah Diallo",
    matricule: "20INGE0412",
    sujet: "Analyse des performances des réseaux 5G en milieu urbain camerounais",
    date: "12/07/2026",
    salle: "B-104",
    heure: "09h00",
    note: 18.0,
    mention: "Excellent",
    jury: [
      { role: "Encadreur académique", nom: "Dr. Sophie Nkoulou" },
      { role: "Président du jury", nom: "Pr. Marie Ondo" },
      { role: "Examinateur", nom: "Pr. Jean-Paul Mbella" },
    ],
  },
  {
    id: "4",
    candidat: "Kwame Boateng",
    matricule: "20INGE0356",
    sujet: "Étude comparative des algorithmes de chiffrement pour l'Internet des Objets",
    date: "11/07/2026",
    salle: "A-201",
    heure: "11h30",
    note: 12.5,
    mention: "Assez Bien",
    jury: [
      { role: "Encadreur académique", nom: "Dr. Alain Tchinda" },
      { role: "Président du jury", nom: "Pr. Marie Ondo" },
      { role: "Examinateur", nom: "Dr. Sophie Nkoulou" },
    ],
  },
  {
    id: "5",
    candidat: "Lina Kaboré",
    matricule: "20INGE0402",
    sujet: "Développement d'une plateforme de télémédecine pour les zones rurales",
    date: "11/07/2026",
    salle: "B-104",
    heure: "15h30",
    note: 15.0,
    mention: "Bien",
    jury: [
      { role: "Encadreur académique", nom: "Pr. Marie Ondo" },
      { role: "Président du jury", nom: "Dr. Sophie Nkoulou" },
      { role: "Examinateur", nom: "Pr. Jean-Paul Mbella" },
    ],
  },
  {
    id: "6",
    candidat: "Yannick Owona",
    matricule: "20INGE0399",
    sujet: "Modélisation hydrologique des bassins versants avec deep learning",
    date: "10/07/2026",
    salle: "C-002",
    heure: "10h30",
    note: 17.0,
    mention: "Très Bien",
    jury: [
      { role: "Encadreur académique", nom: "Pr. Jean-Paul Mbella" },
      { role: "Président du jury", nom: "Pr. Marie Ondo" },
      { role: "Examinateur", nom: "Dr. Alain Tchinda" },
    ],
  },
  {
    id: "7",
    candidat: "Fatima Zahra",
    matricule: "20INGE0450",
    sujet: "Optimisation des chaînes logistiques par algorithmes génétiques",
    date: "10/07/2026",
    salle: "C-002",
    heure: "14h00",
    note: 13.0,
    mention: "Assez Bien",
    jury: [
      { role: "Encadreur académique", nom: "Dr. Sophie Nkoulou" },
      { role: "Président du jury", nom: "Pr. Jean-Paul Mbella" },
      { role: "Examinateur", nom: "Pr. Marie Ondo" },
    ],
  },
];
