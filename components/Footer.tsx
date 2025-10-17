import React, { useEffect } from 'react';
import { FacebookIcon, InstagramIcon, ThreadsIcon, TiktokIcon, LinkedinIcon, MailIcon, YouTubeIcon } from './icons';
import { View } from '../types';

/**
 * @interface FooterProps
 * @description Props for the Footer component.
 */
interface FooterProps {
    onNavigate: (page: View) => void;
}

/**
 * @description The main footer for the website. It contains navigation links, social media icons, and copyright information.
 */
const Footer: React.FC<FooterProps> = ({ onNavigate }) => {

    /**
     * @description Handles clicks on internal navigation links within the footer.
     * Prevents the default anchor tag behavior and uses the app's internal navigation system.
     */
    const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>, page: View) => {
        e.preventDefault();
        onNavigate(page);
    };

    return (
        <div className="bg-[#3A3A3A]">
            <footer className="bg-[#3A3A3A] text-gray-300 p-5 border-t border-gray-700">
                <div className="max-w-7xl mx-auto flex justify-between flex-wrap gap-5">
                    {/* About Section */}
                    <div className="flex-1 m-2.5 min-w-[160px]">
                        <h4 className="font-oswald text-white mb-2.5 uppercase text-lg tracking-wide">ABOUT</h4>
                        <ul className="list-none p-0 m-0 text-xs space-y-1.5 uppercase">
                            <li><button onClick={(e) => handleNavClick(e, 'about')} className="hover:text-white transition-colors text-left w-full">ABOUT LEVEL</button></li>
                            <li><button onClick={(e) => handleNavClick(e, 'partners')} className="hover:text-white transition-colors text-left w-full">OUR PARTNERS</button></li>
                            <li>
                                <button onClick={(e) => handleNavClick(e, 'services')} className="hover:text-white transition-colors text-left w-full">OUR SERVICES</button>
                            </li>
                            <li><button onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-white transition-colors text-left w-full">LOCATION</button></li>
                        </ul>
                    </div>
                    {/* Services Section */}
                    <div className="flex-1 m-2.5 min-w-[160px]">
                        <h4 className="font-oswald text-white mb-2.5 uppercase text-lg tracking-wide">SUPPORT</h4>
                        <ul className="list-none p-0 m-0 text-xs space-y-1.5 uppercase">
                            <li><button onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-white transition-colors text-left w-full">FAQS</button></li>
                            <li><button onClick={(e) => handleNavClick(e, 'terms-of-service')} className="hover:text-white transition-colors text-left w-full">TERMS OF SERVICE</button></li>
                            <li><button onClick={(e) => handleNavClick(e, 'return-policy')} className="hover:text-white transition-colors text-left w-full">RETURN AND EXCHANGE POLICY</button></li>
                            <li><button onClick={(e) => handleNavClick(e, 'privacy-policy')} className="hover:text-white transition-colors text-left w-full">PRIVACY POLICY</button></li>
                            <li className="h-4 cursor-pointer">
                                <button onClick={(e) => handleNavClick(e, 'admin')} className="w-full h-full" aria-label="Admin Access"></button>
                            </li>
                        </ul>
                    </div>
                    {/* Connect Section */}
                    <div className="flex-1 m-2.5 min-w-[160px]">
                        <h4 className="font-oswald text-white mb-2.5 uppercase text-lg tracking-wide">CONNECT</h4>
                        <div className="flex gap-[15px] my-2.5 items-center">
                            <a href="https://www.facebook.com/levelcustomsapparel" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 text-xl hover:text-white transition-colors"><FacebookIcon /></a>
                            <a href="https://www.instagram.com/levelcustomsapparel/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-xl hover:text-white transition-colors"><InstagramIcon /></a>
                            <a href="https://youtube.com/@levelcustomsapparel" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 text-xl hover:text-white transition-colors"><YouTubeIcon className="w-6 h-6" /></a>
                            <a href="https://www.threads.net/@levelcustomsapparel" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="text-gray-400 text-xl hover:text-white transition-colors"><ThreadsIcon /></a>
                            <a href="https://www.tiktok.com/@levelcustomsapparel" aria-label="Tiktok" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-xl hover:text-white transition-colors"><TiktokIcon /></a>
                            <a href="https://www.linkedin.com/company/level-customs-apparel" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-xl hover:text-white transition-colors"><LinkedinIcon /></a>
                            <a href="mailto:levelcustomapparel@gmail.com" aria-label="Email" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-xl hover:text-white transition-colors"><MailIcon className="w-6 h-6" /></a>
                        </div>
                    </div>
                </div>
            </footer>
            {/* Copyright notice */}
            <div className="text-center p-2.5 font-serif text-gray-400 bg-black">
                <p>Copyright &copy; {new Date().getFullYear()} - <b className="text-white">LEVEL CUSTOMS</b></p>
            </div>
        </div>
    );
};

export default Footer;