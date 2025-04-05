import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import WorkoutCard from "../components/WorkoutCard";
import NewWorkoutModal from "../components/NewWorkoutModal";
import NewDetailModal from "../components/NewDetailModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { IoMdAddCircle } from "react-icons/io";
import type { Workout } from "../types/workout";
import WorkoutFilter from "../components/WorkoutFilter";

export default function TrainingScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newWorkout, setNewWorkout] = useState<Workout>({
        id: "",  // Ajoute un ID vide pour que ça corresponde au type
        title: "",
        schedule: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
        },
        exercises: [],
        categories: [],
        difficulty: "Facile",
        completedToday: false,
    });
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [newDetail, setNewDetail] = useState("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

    const addWorkout = async () => {
        if (!newWorkout.title) return;
        try {
            const docRef = await addDoc(collection(db, "workouts"), {
                title: newWorkout.title,
                categories: newWorkout.categories || [],
                difficulty: newWorkout.difficulty || "Facile",
                schedule: newWorkout.schedule || {},
                exercises: newWorkout.exercises || [],
            });
            console.log("✅ Tâche ajoutée avec succès ! ID :", docRef.id);
            setIsModalVisible(false);
            setNewWorkout({
                id: "",  // Ajout d'un ID vide pour respecter le type Workout
                title: "",
                schedule: {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                },
                exercises: [],
                categories: [],
                difficulty: "Facile",
                completedToday: false,
            });
            fetchWorkouts();
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout de la tâche:", error);
        }
    };

    const fetchWorkouts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "workouts"));
            const workoutsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title || "",
                categories: doc.data().categories || [],
                difficulty: doc.data().difficulty || "Facile",
                schedule: doc.data().schedule || {},
                exercises: doc.data().exercises || [],
            }));
            setWorkouts(workoutsList);
            console.log("📥 Workouts récupérés :", workoutsList);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des tâches :", error);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const addDetailToTask = async () => {
        if (!selectedWorkout || !newDetail) return;
        try {
            const workoutRef = doc(db, "workouts", selectedWorkout.id);
            const updatedDetails = [...(selectedWorkout.exercises || []), newDetail];
            await updateDoc(workoutRef, { exercises: updatedDetails });
            fetchWorkouts();
            setIsDetailModalVisible(false);
            setNewDetail("");
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout du détail :", error);
        }
    };

    const deleteWorkout = async (id: string) => {
        try {
            await deleteDoc(doc(db, "workouts", id));
            fetchWorkouts();
        } catch (error) {
            console.error("❌ Erreur lors de la suppression de la tâche :", error);
        }
    };

    // Au lieu de supprimer directement, on affiche la modal de confirmation
    const handleDeleteClick = (id: string) => {
        const workout = workouts.find((w) => w.id === id);
        if (workout) {
            setWorkoutToDelete(workout);
            setShowConfirmModal(true);
        }
    };

    const confirmDelete = async () => {
        if (workoutToDelete) {
            await deleteWorkout(workoutToDelete.id);
            setShowConfirmModal(false);
            setWorkoutToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setWorkoutToDelete(null);
    };

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] pt-[60px] flex flex-col min-h-screen">
            {/* Header */}
            <WorkoutFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            />
            <div className="flex justify-between items-center p-[30px]">
                <h1
                    className="text-[28px] font-bold text-white"
                    style={{ textShadow: "0px 0px 10px #60a5fa" }}
                >
                    Tâches
                </h1>
                <button onClick={() => setIsModalVisible(true)} className="focus:outline-none">
                    <IoMdAddCircle size={30} color="#60a5fa" />
                </button>
            </div>

            {/* Liste des workouts */}
            <div className="px-5 pb-20 overflow-auto">
            {workouts.length > 0 ? (
                    workouts
                        .filter((workout) =>
                        selectedCategory
                            ? workout.categories?.includes(selectedCategory)
                            : true
                        )
                        .map((workout) => (
                        <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            onDelete={handleDeleteClick}
                            onAddDetail={(workout) => {
                            setSelectedWorkout(workout);
                            setIsDetailModalVisible(true);
                            }}
                        />
                        ))
                    ) : (
                    <p className="text-white text-center mt-[20px]">
                        Aucune tâche disponible
                    </p>
                )}
            </div>

            {/* Modals */}
            <NewWorkoutModal
                visible={isModalVisible}
                newWorkout={newWorkout}
                onChangeField={(field, value) =>
                    setNewWorkout({ ...newWorkout, [field]: value })
                }
                onToggleDay={(dayKey) =>
                    setNewWorkout({
                        ...newWorkout,
                        schedule: {
                            ...newWorkout.schedule,
                            [dayKey as keyof Workout["schedule"]]: !newWorkout.schedule?.[dayKey as keyof Workout["schedule"]],
                        },
                    })
                }
                onSave={addWorkout}
                onCancel={() => setIsModalVisible(false)}
            />
            <NewDetailModal
                visible={isDetailModalVisible}
                newDetail={newDetail}
                onChangeDetail={setNewDetail}
                onSave={addDetailToTask}
                onCancel={() => setIsDetailModalVisible(false)}
            />
            <ConfirmDeleteModal
                visible={showConfirmModal}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}
