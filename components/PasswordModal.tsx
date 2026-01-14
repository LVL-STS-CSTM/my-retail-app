import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons';
import Button from './Button';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string, username: string) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Reset fields when modal is closed
        if (!isOpen) {
            setPassword('');
            setUsername('');
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password, username);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div 
                className={`bg-white rounded-lg shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                role="dialog" aria-modal="true" aria-labelledby="password-modal-title"
            >
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 id="password-modal-title" className="text-xl font-semibold">Admin Access</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label htmlFor="admin-username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="admin-username"
                            name="admin-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3A3A3A] focus:border-[#3A3A3A] sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="admin-password"
                            name="admin-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3A3A3A] focus:border-[#3A3A3A] sm:text-sm"
                        />
                    </div>
                    <footer className="pt-2 flex justify-end space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="solid">
                            Login
                        </Button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;