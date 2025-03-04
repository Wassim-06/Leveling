// ConfirmDeleteModal.tsx
import React from "react";

interface ConfirmDeleteModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ visible, onConfirm, onCancel }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(15,23,42,0.9)] z-50">
            <div className="w-[90%] max-w-md bg-[#1e3a8a] rounded-2xl p-6 border border-[#60a5fa]">
                <h2 className="text-2xl font-bold text-white text-center mb-4">
                    Confirmer la suppression
                </h2>
                <p className="text-white text-center mb-6">
                    Êtes-vous sûr de supprimer cette quête ?
                </p>
                <div className="flex justify-between gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 p-3 rounded-xl bg-[rgba(239,68,68,0.2)] border border-[#ef4444] text-white font-bold"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 p-3 rounded-xl bg-[rgba(96,165,250,0.2)] border border-[#60a5fa] text-white font-bold"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
