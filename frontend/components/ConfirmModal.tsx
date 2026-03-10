"use client";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Yes, Proceed",
    cancelText = "Cancel",
    isDanger = true
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-white/80 backdrop-blur-xl animate-fade-in ">
            <div className="bg-white w-full max-w-lg rounded-[4.5rem] border border-black/[0.05] shadow-[0_40px_120px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-zoom-in relative">
                <div className="p-14 text-center">
                    <div className={`w-32 h-32 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 ${isDanger ? 'bg-red-50 text-red-500' : 'bg-accent/5 text-accent'} border border-black/[0.03] shadow-inner`}>
                        {isDanger ? <FiTrash2 size={48} /> : <FiAlertTriangle size={48} />}
                    </div>

                    <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-5 leading-none px-4">
                        {title}
                    </h2>

                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.25em] leading-relaxed mb-14 px-8 opacity-80">
                        {message}
                    </p>

                    <div className="grid grid-cols-2 gap-5">
                        <button
                            onClick={onClose}
                            className="w-full py-7 rounded-[2.2rem] font-black uppercase tracking-widest text-[11px] text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all text-center border border-slate-200/50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`w-full py-7 rounded-[2.2rem] font-black uppercase tracking-widest text-[11px] text-white transition-all shadow-2xl flex items-center justify-center gap-3 ${isDanger ? 'bg-red-600 shadow-red-600/30' : 'bg-accent shadow-accent/30'} hover:scale-[1.03] active:scale-95 border-b-6 border-black/20`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
