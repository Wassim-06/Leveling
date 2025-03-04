import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Trophy, Dumbbell, User } from "lucide-react"; // Ajout d'icônes
import "../styles/layout.css";

const MainLayout: React.FC = () => {
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
