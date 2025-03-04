import React, { useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Trophy, Dumbbell, User } from "lucide-react"; // Ajout d'icônes
import "../styles/layout.css";

const MainLayout: React.FC = () => {
    const location = useLocation(); // Équivalent de usePathname()

    useEffect(() => {
        const playSound = async () => {
            try {
                const sound = new Audio("/sounds/level-up.mp3"); // 🔊 Mets le fichier son dans `public/sounds/`
                await sound.play();
            } catch (error) {
                console.error("❌ Erreur lors de la lecture du son :", error);
            }
        };

        playSound();
    }, [location.pathname]); // Se déclenche à chaque changement de page

    return (
        <div className="layout">
            <main>
                <Outlet />
            </main>

            {/* Barre de navigation en bas */}
            <nav className="nav-bar">
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                    <Trophy size={24} /> Quêtes
                </NavLink>
                <NavLink to="/training" className={({ isActive }) => (isActive ? "active" : "")}>
                    <Dumbbell size={24} /> Tâches
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
                    <User size={24} /> Profil
                </NavLink>
            </nav>
        </div>
    );
};

export default MainLayout;
