import React from "react";
import type { Workout } from "../types/workout";

interface NewWorkoutModalProps {
    visible: boolean;
    newWorkout: Partial<Workout>;
    onChangeField: (field: keyof Partial<Workout>, value: any) => void;
    onToggleDay: (dayKey: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const NewWorkoutModal: React.FC<NewWorkoutModalProps> = ({
    visible,
    newWorkout,
    onChangeField,
    onToggleDay,
    onSave,
    onCancel,
}) => {
    const daysLabels = ["L", "M", "M", "J", "V", "S", "D"];
    const daysKeys = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];
    const difficulties = ["Facile", "Moyen", "Difficile"];
    const difficultyColors: { [key: string]: string } = {
        Facile: "green",
        Moyen: "orange",
        Difficile: "red",
    };
    const categories = [
        "Foi",
        "Agilité",
        "Endurance",
        "Explosivité",
        "Force",
        "Intelligence",
    ];

    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(15,23,42,0.9)] z-50">
            <div className="w-[90%] bg-[#1e3a8a] rounded-[20px] p-5 border border-[#60a5fa]">
                <h2 className="text-2xl font-bold text-white mb-5 text-center">
                    Nouvelle Tâche
                </h2>

                <input
                    type="text"
                    placeholder="Nom de la tâche"
                    value={newWorkout.title || ""}
                    onChange={(e) => onChangeField("title", e.target.value)}
                    className="w-full bg-[rgba(96,165,250,0.1)] border border-[#60a5fa] rounded-[10px] p-4 text-white mb-5 placeholder-[#64748b] outline-none"
                />

                <p className="text-white text-lg mb-3">Catégories</p>
                <div className="flex flex-wrap gap-2.5 mb-5">
                    {categories.map((category) => {
                        const isSelected = newWorkout.categories?.includes(category);
                        return (
                            <button
                                key={category}
                                onClick={() => {
                                    const updatedCategories = isSelected
                                        ? newWorkout.categories?.filter((c) => c !== category) || []
                                        : [...(newWorkout.categories || []), category];
                                    onChangeField("categories", updatedCategories);
                                }}
                                className={`p-2.5 rounded-[10px] border border-[#60a5fa] ${isSelected ? "bg-blue-500" : "bg-[rgba(96,165,250,0.1)]"
                                    }`}
                            >
                                <span className="text-white text-sm font-bold">
                                    {category}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <p className="text-white text-lg mb-3">Difficulté</p>
                <div className="flex justify-between mb-5">
                    {difficulties.map((difficulty) => {
                        const isSelected = newWorkout.difficulty === difficulty;
                        return (
                            <button
                                key={difficulty}
                                onClick={() => onChangeField("difficulty", difficulty)}
                                className={`flex-1 p-2.5 rounded-[10px] border-2 items-center mx-[5px] flex justify-center`}
                                style={
                                    isSelected
                                        ? {
                                            borderColor: difficultyColors[difficulty],
                                            backgroundColor: difficultyColors[difficulty] + "20",
                                        }
                                        : {}
                                }
                            >
                                <span
                                    className="font-bold"
                                    style={{ color: difficultyColors[difficulty] }}
                                >
                                    {difficulty}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mb-5">
                    <p className="text-white text-lg mb-3">Programmation</p>
                    <div className="flex justify-between">
                        {daysLabels.map((day, index) => {
                            const dayKey = daysKeys[index];
                            const isSelected = newWorkout.schedule && newWorkout.schedule[dayKey as keyof Workout["schedule"]];
                            return (
                                <button
                                    key={index}
                                    onClick={() => onToggleDay(dayKey)}
                                    className={`w-10 h-10 rounded-full border border-[#60a5fa] flex justify-center items-center ${isSelected ? "bg-blue-500" : "bg-[rgba(96,165,250,0.1)]"
                                        }`}
                                >
                                    <span className="text-white text-base">{day}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-between gap-2.5">
                    <button
                        onClick={onCancel}
                        className="flex-1 p-3.5 rounded-[10px] flex items-center justify-center bg-[rgba(239,68,68,0.2)] border border-[#ef4444]"
                    >
                        <span className="text-white text-base font-bold">Annuler</span>
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 p-3.5 rounded-[10px] flex items-center justify-center bg-[rgba(96,165,250,0.2)] border border-[#60a5fa]"
                    >
                        <span className="text-white text-base font-bold">Sauvegarder</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewWorkoutModal;
