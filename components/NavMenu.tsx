
import React from 'react';
import { View } from '../types';

interface NavMenuProps {
    onNavigate: (view: View | string, value?: string) => void;
    onSubscribeClick: () => void;
    isMobile: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({ onNavigate, onSubscribeClick, isMobile }) => {
    const navClass = isMobile ? "px-2 pt-2 pb-3 space-y-1" : "hidden md:flex md:space-x-8";
    const linkClass = isMobile ? "block px-3 py-2 rounded-md text-base font-medium" : "text-sm font-medium";

    return (
        <div className={navClass}>
            <button onClick={() => onNavigate('all-products')} className={`${linkClass} hover:opacity-80`}>All Products</button>
            <button onClick={() => onNavigate('services')} className={`${linkClass} hover:opacity-80`}>Services</button>
            <button onClick={() => onNavigate('about')} className={`${linkClass} hover:opacity-80`}>About Us</button>
            <button onClick={() => onNavigate('partners')} className={`${linkClass} hover:opacity-80`}>Partners</button>
            <button onClick={onSubscribeClick} className={`${linkClass} hover:opacity-80`}>Subscribe</button>
        </div>
    );
};

export default NavMenu;
