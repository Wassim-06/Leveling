// components/WorkoutFilter.tsx
import React from "react";

interface WorkoutFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  "Foi",
  "Agilité",
  "Endurance",
  "Food",
  "Force",
  "Intelligence",
];

const WorkoutFilter: React.FC<WorkoutFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-5">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`p-2 px-4 rounded-[10px] border ${
            selectedCategory === category
              ? "bg-blue-500 border-blue-400"
              : "bg-[rgba(96,165,250,0.1)] border-[#60a5fa]"
          }`}
        >
          <span className="text-white font-bold">{category}</span>
        </button>
      ))}
      {/* Bouton pour réinitialiser */}
      <button
        onClick={() => onSelectCategory("")}
        className="p-2 px-4 rounded-[10px] bg-red-500 border border-red-400"
      >
        <span className="text-white font-bold">Tous</span>
      </button>
    </div>
  );
};

export default WorkoutFilter;
