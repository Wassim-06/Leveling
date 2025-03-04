export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

export interface Workout {
  id: string;
  title: string;
  schedule: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
  };
  exercises: Exercise[];
  categories?: string[];
  difficulty?: string;
  completedToday?: boolean;  // ✅ Ajout pour éviter l'erreur
}

export interface UserStats {
  level: number;
  rank: string;
  exp: number;
  nextLevelExp: number;
  stats: {
    force: number;
    endurance: number;
    explosivite: number;
    agilite: number;
  };
}