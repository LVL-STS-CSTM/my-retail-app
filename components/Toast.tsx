import React, { useState, useEffect } from 'react';

/**
 * @interface ToastProps
 * @description Props for the Toast component.
 * @property {string} message - The message to be displayed in the toast.
 * @property {() => void} onClose - Callback function to signal that the toast has finished its lifecycle.
 */
interface ToastProps {
    message: string;
    onClose: () => void;
}

/**
 * @description A notification component that appears and then automatically fades out.
 * It's used to provide non-intrusive feedback to the user.
 */
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    // State to control the visibility and animations of the toast.
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // When the component mounts, trigger the fade-in animation.
        setVisible(true);

        // Set a timer to automatically close the toast after a few seconds.
        const timer = setTimeout(() => {
            // Trigger the fade-out animation.
            setVisible(false);
            // Wait for the fade-out animation to complete (300ms) before calling the onClose callback.
            setTimeout(onClose, 300);
        }, 2700); // Total lifetime is 3000ms (2700ms visible + 300ms for fade-out).

        // Cleanup function to clear the timer if the component unmounts prematurely.
        return () => clearTimeout(timer);
    }, [onClose]); // The effect depends on the onClose function.

    return (
        <div 
            className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#3A3A3A] text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
            {message}
        </div>
    );
};

export default Toast;