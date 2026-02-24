import React from 'react';
import { useAuth } from '../helper/AuthContext';
import { LogOut, X } from 'lucide-react';

function ConfirmLogoutModal() {
    const { closeModal, logout } = useAuth();

    const handleConfirmLogout = () => {
        logout();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <LogOut className="size-5 text-gray-700" />
                        Confirm Logout
                    </h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X className="size-5" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
                <div className="flex justify-end gap-4">
                    <button onClick={closeModal} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer">Cancel</button>
                    <button onClick={handleConfirmLogout} className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-900 text-white cursor-pointer">Logout</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmLogoutModal;