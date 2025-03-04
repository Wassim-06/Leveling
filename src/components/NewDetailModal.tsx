import React from "react";

interface NewDetailModalProps {
    visible: boolean;
    newDetail: string;
    onChangeDetail: (text: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const NewDetailModal: React.FC<NewDetailModalProps> = ({
    visible,
    newDetail,
    onChangeDetail,
    onSave,
    onCancel,
}) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(15,23,42,0.9)] z-50">
            <div className="w-[90%] bg-[#1e3a8a] rounded-2xl p-5 border border-[#60a5fa]">
                <h2 className="text-2xl font-bold text-white mb-5 text-center">
                    Ajouter un détail
                </h2>
                <input
                    type="text"
                    placeholder="Détail de la tâche"
                    value={newDetail}
                    onChange={(e) => onChangeDetail(e.target.value)}
                    className="w-full bg-[rgba(96,165,250,0.1)] border border-[#60a5fa] rounded-xl p-4 text-white mb-5 placeholder-[#64748b] outline-none"
                />
                <div className="flex flex-row justify-between gap-2.5">
                    <button
                        onClick={onCancel}
                        className="flex-1 p-3.5 rounded-xl flex items-center justify-center bg-[rgba(239,68,68,0.2)] border border-[#ef4444]"
                    >
                        <span className="text-white text-base font-bold">Annuler</span>
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 p-3.5 rounded-xl flex items-center justify-center bg-[rgba(96,165,250,0.2)] border border-[#60a5fa]"
                    >
                        <span className="text-white text-base font-bold">Ajouter</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewDetailModal;
