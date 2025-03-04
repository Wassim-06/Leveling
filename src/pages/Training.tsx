import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import WorkoutCard from "../components/WorkoutCard";
import NewWorkoutModal from "../components/NewWorkoutModal";
import NewDetailModal from "../components/NewDetailModal";
import { IoMdAddCircle } from "react-icons/io";

export default function TrainingScreen() {
    const [workouts, setWorkouts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newWorkout, setNewWorkout] = useState({
        title: "",
        schedule: {},
        exercises: [],
        categories: [],
        difficulty: "",
    });
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [newDetail, setNewDetail] = useState("");

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
                title: "",
                schedule: {},
                exercises: [],
                categories: [],
                difficulty: "",
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

    const deleteWorkout = async (id) => {
        try {
            await deleteDoc(doc(db, "workouts", id));
            fetchWorkouts();
        } catch (error) {
            console.error("❌ Erreur lors de la suppression de la tâche :", error);
        }
    };

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] pt-[60px] flex flex-col min-h-screen">
            {/* Header */}
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
                    workouts.map((workout) => (
                        <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            onDelete={deleteWorkout}
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
                            [dayKey]: !newWorkout.schedule?.[dayKey],
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
        </div>
    );
}
