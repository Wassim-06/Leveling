import React from "react";
import { IoMdTrash } from "react-icons/io";
import type { Workout } from "../types/workout";

interface WorkoutCardProps {
    workout: Workout;
    onDelete: (id: string) => void;
    onAddDetail: (workout: Workout) => void;
}

const difficultyColors: { [key: string]: string } = {
    Facile: "green",
    Moyen: "orange",
    Difficile: "red",
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onDelete, onAddDetail }) => {
    console.log("WorkoutCard reçoit :", workout);

    return (
        <div className="bg-[rgba(96,165,250,0.1)] rounded-[15px] p-5 mb-4 border border-[#60a5fa]">
            <div className="flex justify-between items-center mb-2">
                {/* Informations sur l'entraînement */}
                <div className="flex-1">
                    <p className="text-xl font-bold text-white">{workout.title}</p>
                    {workout.categories && workout.categories.length > 0 && (
                        <p className="text-sm text-[#93c5fd] mt-1">
                            Catégories: {workout.categories.join(", ")}
                        </p>
                    )}
                    {workout.difficulty && (
                        <p className="text-sm font-bold mt-1" style={{ color: difficultyColors[workout.difficulty] }}>
                            Difficulté: {workout.difficulty}
                        </p>
                    )}
                    <p className="text-sm text-[#93c5fd] mt-1">
                        {Object.keys(workout.schedule || {})
                            .filter((day) => workout.schedule && workout.schedule[day as keyof Workout["schedule"]])
                            .join(", ") || "Aucun jour sélectionné"}
                    </p>
                </div>

                {/* Boutons d'actions regroupés en colonne */}
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => onAddDetail(workout)}
                        className="bg-[rgba(96,165,250,0.2)] p-2 rounded flex items-center justify-center"
                    >
                        <span className="text-[#60a5fa] text-base">➕</span>
                    </button>
                    <button onClick={() => onDelete(workout.id)} className="p-1">
                        <IoMdTrash size={24} color="#f87171" />
                    </button>
                </div>
            </div>

            {/* Liste des exercices */}
            {workout.exercises && workout.exercises.length > 0 && (
                <div className="flex flex-col space-y-1">
                    {workout.exercises.map((detail, index) => (
                        <p key={`${detail.id}-${index}`} className="text-base text-white">
                            • {detail.name} ({detail.sets}x{detail.reps})
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkoutCard;
