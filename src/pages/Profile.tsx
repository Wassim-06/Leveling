import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const userId = "testUser"; // Remplace par l'ID de l'utilisateur connecté
        const docRef = doc(db, "users", userId);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                console.log("📥 Profil mis à jour :", docSnap.data());
                setProfile(docSnap.data());
            } else {
                console.log("❌ Aucun profil trouvé !");
            }
        });

        return () => unsubscribe();
    }, []);

    const skillOrder = [
        "Foi",
        "Agilité",
        "Endurance",
        "Explosivité",
        "Force",
        "Intelligence",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white flex flex-col items-center pt-[115px]">
            <div className="w-full flex justify-center">
                {profile ? (
                    <div className="flex flex-col items-center gap-[5px]">
                        <h1
                            className="text-[32px] font-bold"
                            style={{ textShadow: "0px 0px 10px #60a5fa" }}
                        >
                            {profile.username || "Utilisateur"}
                        </h1>
                        <p className="text-xl text-[#60a5fa] mt-[5px]">
                            {profile.rank || "Hunter E"}
                        </p>
                    </div>
                ) : (
                    <h1
                        className="text-[32px] font-bold"
                        style={{ textShadow: "0px 0px 10px #60a5fa" }}
                    >
                        Chargement...
                    </h1>
                )}
            </div>

            {profile && (
                <div className="m-5 p-5 bg-[rgba(96,165,250,0.1)] rounded-[15px] border border-[#60a5fa] max-w-[355px] w-full">
                    <div className="flex justify-between">
                        <p className="text-2xl font-bold">Niveau {profile.level}</p>
                        <p className="text-lg text-[#60a5fa] text-center">
                            {profile.class}
                        </p>
                    </div>

                    <div className="relative h-[20px] bg-[rgba(0,0,0,0.3)] rounded-[10px] mb-[20px] overflow-hidden mt-4">
                        <div
                            className="absolute top-0 left-0 h-full bg-[#60a5fa] rounded-[10px]"
                            style={{ width: `${(profile.exp / profile.nextLevelExp) * 100}%` }}
                        ></div>
                        <p className="absolute w-full text-center text-white text-[12px] top-[50%] translate-y-[-50%]">
                            {profile.exp} / {profile.nextLevelExp} XP
                        </p>
                    </div>

                    {profile.stats && (
                        <div className="flex flex-wrap justify-between gap-y-[10px] gap-x-[5px]">
                            {skillOrder.map((stat) => (
                                <div
                                    key={stat}
                                    className="bg-[rgba(255,255,255,0.1)] p-[7px] rounded-[5px] w-[46%] text-center text-[16px] font-bold"
                                >
                                    <p>
                                        {stat}: {profile.stats[stat] || 0}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
