import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, getDocs  } from "firebase/firestore";
import { db } from "../firebase";

type Enemy = {
    id: string;
    name: string;
    description: string;
    stat: string;
    successXP: number;
    failXP: number;
    failStatPenalty: number;
    completedToday: boolean;
};

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



const Enemies: React.FC = () => {
    const [enemyResults, setEnemyResults] = useState<Record<string, "success" | "fail" | null>>({});
    const [timeLeft, setTimeLeft] = useState(getTimeLeftUntilMidnight());
    const [enemies, setEnemies] = useState<Enemy[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeftUntilMidnight());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const resetDailyEnemyState = async () => {
            const today = new Date().toISOString().split("T")[0];
            const lastReset = localStorage.getItem("lastEnemyResetDate");
    
            if (lastReset !== today) {
                // 1. Vider les résultats locaux
                localStorage.removeItem("enemyResults");
                setEnemyResults({});
            
                // ⛔️ PAS DE RESET DES penaltyPoints ICI
            
                // 2. Sauvegarder la date de reset
                localStorage.setItem("lastEnemyResetDate", today);
            } else {
                // Si ce n'est pas un nouveau jour → on restaure les résultats existants
                const storedResults = localStorage.getItem("enemyResults");
                if (storedResults) {
                    const parsed = JSON.parse(storedResults);
                    if (parsed.date === today) {
                        setEnemyResults(parsed.results);
                    }
                }
            }
        };
    
        resetDailyEnemyState();
    }, []);

    useEffect(() => {
        const resetCompletedTodayFlags = async () => {
            const lastReset = localStorage.getItem("enemyCompletedReset");
            const today = new Date().toISOString().split("T")[0];
    
            if (lastReset !== today) {
                const snapshot = await getDocs(collection(db, "enemies"));
                const updates = snapshot.docs.map((docSnap) =>
                    updateDoc(doc(db, "enemies", docSnap.id), { completedToday: false })
                );
                await Promise.all(updates);
                localStorage.setItem("enemyCompletedReset", today);
                console.log("🌀 Tous les completedToday réinitialisés pour aujourd'hui !");
            }
        };
    
        resetCompletedTodayFlags();
    }, []);
    

    useEffect(() => {
        const fetchEnemies = async () => {
            const snapshot = await getDocs(collection(db, "enemies"));
            const enemyList: Enemy[] = snapshot.docs.map((doc) => ({
                ...(doc.data() as Omit<Enemy, "id">),
                id: doc.id,
            }));            
            setEnemies(enemyList);
        };
    
        fetchEnemies();
    }, []);
    
    const handleEnemyAction = async (enemy: Enemy, action: "success" | "fail") => {
        const userId = "testUser";
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const updatedStats = { ...userData.stats };
        let newExp = userData.exp || 0;

        if (action === "success") {
            newExp += enemy.successXP;
            updatedStats[enemy.stat] = (updatedStats[enemy.stat] || 0) + 1;
        } else {
            newExp = Math.max(0, newExp + enemy.failXP);
            updatedStats[enemy.stat] = Math.max(0, (updatedStats[enemy.stat] || 0) - enemy.failStatPenalty);
        }

        await updateDoc(userRef, {
            exp: newExp,
            stats: updatedStats,
        });

        await updateDoc(doc(db, "enemies", enemy.id), {
            completedToday: true, // 👈 Marque l’ennemi comme complété aujourd’hui
        });        

        const newResults = {
            ...enemyResults,
            [enemy.id]: action,
        };

        setEnemyResults(newResults);
        if (action === "fail") {
            const currentPenaltyPoints = userData.penaltyPoints || 0;
            await updateDoc(userRef, {
                penaltyPoints: currentPenaltyPoints + 1,
            });
        }              
        localStorage.setItem(
            "enemyResults",
            JSON.stringify({
                date: new Date().toISOString().split("T")[0],
                results: newResults,
            })
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#3a0d0d] via-[#5a1a1a] to-[#1a0b0b] text-white flex flex-col items-center pt-[100px] px-12">
            <h1 className="text-[28px] font-bold mb-5" style={{ textShadow: "0px 0px 10px #f87171" }}>👹 Donjons</h1>
            <p className="text-[18px] text-[#f87171] mb-5">
                ⏳ {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
            </p>

            <div className="w-full max-w-[400px] flex flex-col gap-5">
                {enemies.map((enemy) => {
                    const result = enemyResults[enemy.id];

                    return (
                        <div
                            key={enemy.id}
                            className="bg-[rgba(248,113,113,0.1)] p-4 rounded-[15px] border border-[#f87171] text-center"
                        >
                            <h2 className="text-[20px] font-bold text-[#f87171] mb-1">{enemy.name}</h2>
                            <p className="text-[14px] text-white mb-1">{enemy.description}</p>
                            <p className="text-[14px] text-green-400">✅ XP si réussite : {enemy.successXP}</p>
                            <p className="text-[14px] text-red-400 mb-3">❌ XP si échec : {enemy.failXP}</p>

                            {enemy.completedToday ? (
                                <p className="font-bold">FINI</p>
                            ) : result ? (
                                <p className={`font-bold text-[16px] ${result === "success" ? "text-green-400" : "text-red-400"}`}>
                                    {result === "success" ? "Réussi 💪" : "Echec 😓"}
                                </p>
                            ) : (
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={() => handleEnemyAction(enemy, "success")}
                                        className="bg-green-500 hover:bg-green-600 text-white px-7 py-2 rounded-[10px] font-bold"
                                    >
                                        Réussi ✅
                                    </button>
                                    <button
                                        onClick={() => handleEnemyAction(enemy, "fail")}
                                        className="bg-red-500 hover:bg-red-600 text-white px-7 py-2 rounded-[10px] font-bold"
                                    >
                                        Echec ❌
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Enemies;
