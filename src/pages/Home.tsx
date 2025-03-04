import React, { useState, useEffect } from "react";
import { collection, doc, updateDoc, getDoc, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const getTimeLeftUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    const timeLeft = midnight.getTime() - now.getTime();
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
};

const getTodayEnglishDay = () => {
    const todayFrench = format(new Date(), "EEEE", { locale: fr }).toLowerCase();
    const dayMap = {
        lundi: "monday",
        mardi: "tuesday",
        mercredi: "wednesday",
        jeudi: "thursday",
        vendredi: "friday",
        samedi: "saturday",
        dimanche: "sunday",
    };
    return dayMap[todayFrench] || "sunday";
};

const Home: React.FC = () => {
    const [dailyQuests, setDailyQuests] = useState<any[]>([]);
    const [timeLeft, setTimeLeft] = useState(getTimeLeftUntilMidnight());

    // Réinitialise completedToday si on est dans un nouveau jour
    useEffect(() => {
        const resetCompletedStatus = async () => {
            const lastReset = localStorage.getItem("lastResetDate");
            const today = new Date().toISOString().split("T")[0]; // format "YYYY-MM-DD"
            if (lastReset !== today) {
                const querySnapshot = await getDocs(collection(db, "workouts"));
                querySnapshot.forEach(async (docSnap) => {
                    const data = docSnap.data();
                    if (data.completedToday) {
                        await updateDoc(doc(db, "workouts", docSnap.id), { completedToday: false });
                    }
                });
                localStorage.setItem("lastResetDate", today);
            }
        };

        resetCompletedStatus();
    }, []);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeftUntilMidnight());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Ecoute en temps réel de la collection workouts
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "workouts"), (querySnapshot) => {
            const workoutsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const today = getTodayEnglishDay();
            const todayWorkouts = workoutsList.filter(
                (workout) => workout.schedule?.[today] && !workout.completedToday
            );

            setDailyQuests(todayWorkouts);
        });
        return () => unsubscribe();
    }, []);

    const handleCompleteQuest = async (questId: string, categories: string[], difficulty: string) => {
        try {
            const sound = new Audio("/sounds/level-up.mp3");
            sound.play();

            const userId = "testUser";
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) return;

            const userData = userSnap.data();
            let pointsToAdd = difficulty === "Moyen" ? 2 : difficulty === "Difficile" ? 3 : 1;
            let bonusXP = difficulty === "Moyen" ? 30 : difficulty === "Difficile" ? 50 : 10;

            const updatedStats = { ...userData.stats };
            categories.forEach((category) => {
                updatedStats[category] = (updatedStats[category] || 0) + pointsToAdd;
            });

            let newExp = (userData.exp || 0) + bonusXP;
            let newLevel = userData.level || 1;
            const nextLevelExp = userData.nextLevelExp || 1000;
            if (newExp >= nextLevelExp) {
                newExp -= nextLevelExp;
                newLevel += 1;
            }

            await updateDoc(userRef, { exp: newExp, level: newLevel, stats: updatedStats });
            await updateDoc(doc(db, "workouts", questId), { completedToday: true });

            setDailyQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== questId));
        } catch (error) {
            console.error("❌ Erreur lors de la validation de la quête :", error);
        }
    };

    const difficultyColors: { [key: string]: string } = {
        Facile: "green",
        Moyen: "orange",
        Difficile: "red",
    };

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white font-sans min-h-screen flex flex-col items-center justify-start pt-[60px] w-full">
            {/* En-tête */}
            <div className="text-center p-5 flex flex-col items-center gap-1">
                <h1 className="text-[28px] font-bold" style={{ textShadow: "0px 0px 10px #60a5fa" }}>
                    Quêtes du Jour
                </h1>
                <p className="text-[18px] text-[#f87171] mt-1">
                    ⏳ {String(timeLeft.hours).padStart(2, "0")}:
                    {String(timeLeft.minutes).padStart(2, "0")}:
                    {String(timeLeft.seconds).padStart(2, "0")}
                </p>
            </div>

            {/* Liste des quêtes */}
            <div className="flex flex-col items-center w-full max-w-[400px] p-5">
                {dailyQuests.length > 0 ? (
                    dailyQuests.map((quest) => (
                        <div
                            key={quest.id}
                            className="bg-[rgba(96,165,250,0.1)] p-5 rounded-[15px] w-full max-w-[350px] border border-[#60a5fa] mb-[15px] text-center"
                        >
                            <h3
                                className="text-[20px] font-bold mb-1"
                                style={{ color: difficultyColors[quest.difficulty] || "#fff" }}
                            >
                                {quest.title}
                            </h3>
                            {quest.categories && quest.categories.length > 0 && (
                                <p className="text-[14px] text-[#60a5fa] mb-1">
                                    Catégories : {quest.categories.join(", ")}
                                </p>
                            )}
                            <p className="text-[14px] text-[#FFD700]">
                                Gain d'XP :{" "}
                                {quest.difficulty === "Facile" ? 10 : quest.difficulty === "Moyen" ? 30 : 50} XP
                            </p>
                            <button
                                onClick={() => handleCompleteQuest(quest.id, quest.categories, quest.difficulty)}
                                className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white border-0 p-[10px] rounded-[8px] cursor-pointer text-[16px] font-bold mt-[10px] w-full"
                            >
                                Finir
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-[18px] text-[#60a5fa] text-center mt-[20px]">
                        Aucune quête aujourd'hui
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;
