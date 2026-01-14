
import React, { useState, useEffect, useMemo } from 'react';
import { useQuote } from '../context/CartContext';
import { SearchIcon, UserIcon, CartIcon, MenuIcon, CloseIcon, ChevronDownIcon } from './icons';
import { View } from '../types';
import Accordion from './Accordion';
import { useData } from '../context/DataContext';

// A reusable icon button component for the header.
const IconButton: React.FC<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    ariaLabel: string,
    className?: string,
    theme?: 'light' | 'dark'
}> = ({ onClick, children, ariaLabel, className = '', theme = 'light' }) => {
    const themeClasses = theme === 'dark'
        ? 'text-gray-200 hover:text-white' // For dark backgrounds
        : 'text-gray-600 hover:text-gray-900'; // For light backgrounds

    return (
        <button onClick={onClick} className={`${themeClasses} transition-colors duration-200 relative ${className}`} aria-label={ariaLabel}>
            {children}
        </button>
    );
};

/**
 * @interface HeaderProps
 * @description Props for the Header component.
 */
interface HeaderProps {
    onNavigate: (page: View, category?: string | null) => void;
    onQuoteClick: () => void;
    onSearchClick: () => void;
    onSubscribeClick: () => void;
    view: View;
    catalogueFilter: { type: 'group' | 'category' | 'gender'; value: string } | null;
    isScrolled: boolean;
}

/**
 * @description A sophisticated, redesigned header component with a centered logo, mega menu, and a responsive mobile menu.
 */
const Header: React.FC<HeaderProps> = ({ onNavigate, onQuoteClick, onSearchClick, onSubscribeClick, view, catalogueFilter, isScrolled }) => {
    // State to manage the visibility of the mobile menu.
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // State to manage the visibility of the desktop mega menu.
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    // State for the new "Explore" dropdown.
    const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);

    const { quoteItems } = useQuote();
    const { products, collections } = useData();

    // Calculate the number of unique item types in the quote list.
    const quoteItemCount = quoteItems.length;

    // Conditionally set header classes based on view and scroll position.
    const isTransparent = view === 'home' && !isScrolled;
    const headerClasses = isTransparent ? 'bg-transparent' : 'bg-[#3A3A3A] shadow-lg';


    // useMemo to build the category structure for the mega menu.
    const productCategories = useMemo(() => {
        return collections.map(groupName => {
            const categoriesSet = new Set<string>();
            products.forEach(product => {
                if (product.categoryGroup === groupName) {
                    categoriesSet.add(product.category);
                }
            });
            return {
                groupName,
                categories: Array.from(categoriesSet).sort()
            };
        }).sort((a,b) => a.groupName.localeCompare(b.groupName));
    }, [products, collections]);
    
    // Data for the "Explore" dropdown menu, now supporting external links.
    const exploreLinks = useMemo(() => [
        { label: 'About Level', view: 'about' as View },
        { label: 'Contact', view: 'contact' as View },
        { label: 'How We Work', view: 'how-we-work' as View },
        { label: 'Our Materials', view: 'materials' as View },
        { label: 'Our Partners', view: 'partners' as View },
        { label: 'Our Services', view: 'services' as View },
    ].sort((a, b) => a.label.localeCompare(b.label)), []);

    useEffect(() => {
        const body = document.body;
        if (isMobileMenuOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
        return () => {
            body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const handleNavClick = (e: React.MouseEvent<HTMLElement>, page: View, category: string | null = null) => {
        e.preventDefault();
        onNavigate(page, category);
        setIsMobileMenuOpen(false);
        setIsMegaMenuOpen(false);
        setIsExploreMenuOpen(false);
    };
    
    const handleSearchIconClick = () => {
        onSearchClick();
        setIsMobileMenuOpen(false);
    }

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${headerClasses}`}>
                {/* Main Header with Logo, Nav, and Icons */}
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8" onMouseLeave={() => { setIsMegaMenuOpen(false); setIsExploreMenuOpen(false); }}>
                    <div className="relative flex items-center justify-between h-14">
                        {/* Left Navigation */}
                        <div className="flex-1 flex justify-start items-center">
                            <nav className="hidden md:flex md:space-x-8">
                                <div onMouseEnter={() => { setIsMegaMenuOpen(true); setIsExploreMenuOpen(false); }}>
                                    <button
                                        onClick={(e) => handleNavClick(e, 'catalogue', null)}
                                        className={`flex items-center space-x-1 text-sm font-medium uppercase tracking-wider transition-colors duration-200 ${view === 'catalogue' && !catalogueFilter ? 'text-white' : 'text-gray-200 hover:text-white'}`}
                                    >
                                        <span>All Products</span>
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                                <div className="relative" onMouseEnter={() => { setIsExploreMenuOpen(true); setIsMegaMenuOpen(false); }}>
                                    <button className="flex items-center space-x-1 text-sm font-medium uppercase tracking-wider text-gray-200 hover:text-white transition-colors duration-200">
                                        <span>Explore</span>
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isExploreMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div
                                        className={`absolute top-full left-0 mt-2 min-w-max bg-white shadow-lg rounded-md border border-gray-100 transition-all duration-300 ease-in-out z-50 ${isExploreMenuOpen ? 'opacity-100 visible animate-fade-in-up [animation-duration:200ms]' : 'opacity-0 invisible'}`}
                                    >
                                        <div className="py-2">
                                            {exploreLinks.map(link => {
                                                const linkContent = (
                                                    <>
                                                        <span>{link.label}</span>
                                                        {(link as any).isLive && (
                                                            <span className="relative flex h-2 w-2 ml-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                            </span>
                                                        )}
                                                    </>
                                                );

                                                if ((link as any).href) {
                                                    return (
                                                        <a
                                                            key={link.label}
                                                            href={(link as any).href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors break-words"
                                                        >
                                                            {linkContent}
                                                        </a>
                                                    );
                                                }
                                                return (
                                                    <button
                                                        key={(link as any).view}
                                                        onClick={(e) => handleNavClick(e, (link as any).view!)}
                                                        className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                    >
                                                        {linkContent}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </nav>
                             {/* Mobile Menu Button (placed left for layout balance) */}
                            <div className="md:hidden">
                                <IconButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} ariaLabel={isMobileMenuOpen ? 'Close menu' : 'Open menu'} theme="dark">
                                    <MenuIcon className="w-7 h-7" />
                                </IconButton>
                            </div>
                        </div>

                        {/* Centered Logo */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                             <button onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-x-3" aria-label="Go to homepage">
                                <img src="https://i.imgur.com/9FhbGuI.png" alt="LEVEL logo" className="h-6 md:h-8 w-auto" />
                                <img src="https://i.imgur.com/pNaqcyN.png" alt="CUSTOMS logo" className="h-6 md:h-8 w-auto hidden md:block" />
                            </button>
                        </div>

                        {/* Right Icons */}
                        <div className="flex-1 flex items-center justify-end">
                            <div className="flex items-center justify-end space-x-4">
                                <div className="hidden sm:flex items-center space-x-4">
                                    <IconButton onClick={onSearchClick} ariaLabel="Search" theme="dark">
                                        <SearchIcon className="w-6 h-6" />
                                    </IconButton>
                                    <IconButton onClick={onSubscribeClick} ariaLabel="Subscribe to Newsletter" theme="dark">
                                        <UserIcon className="w-6 h-6" />
                                    </IconButton>
                                </div>
                                <IconButton onClick={onQuoteClick} ariaLabel="Quote Request List" theme="dark">
                                    <CartIcon className="w-6 h-6" />
                                    {quoteItemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-sans">
                                            {quoteItemCount}
                                        </span>
                                    )}
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    {/* Mega Menu (Desktop) */}
                    <div
                        className={`absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 transition-all duration-300 ease-in-out ${isMegaMenuOpen ? 'opacity-100 visible animate-fade-in-up [animation-duration:200ms]' : 'opacity-0 invisible'}`}
                        onMouseLeave={() => setIsMegaMenuOpen(false)}
                    >
                        <div className="max-w-screen-2xl mx-auto px-8 py-6 grid grid-cols-6 gap-8">
                           {productCategories.map(group => (
                               <div key={group.groupName}>
                                   <button onClick={(e) => handleNavClick(e, 'catalogue', group.groupName)} className="font-oswald text-sm uppercase tracking-wider text-gray-800 mb-4 hover:text-black">{group.groupName}</button>
                                   <ul className="space-y-3">
                                       {group.categories.length > 0 ? group.categories.map(category => (
                                           <li key={category}>
                                               <button onClick={(e) => handleNavClick(e, 'catalogue', category)} className={`text-sm text-gray-500 hover:text-black transition-colors ${catalogueFilter?.type === 'category' && catalogueFilter.value === category ? 'text-black font-medium' : ''}`}>
                                                   {category}
                                               </button>
                                           </li>
                                       )) : (
                                        <li>
                                            <p className="text-sm text-gray-400 italic">No categories yet</p>
                                        </li>
                                       )}
                                   </ul>
                               </div>
                           ))}
                            <div>
                                <h3 className="font-oswald text-sm uppercase tracking-wider text-gray-800 mb-4">Gender</h3>
                                <ul className="space-y-3">
                                    {['Men', 'Women', 'Unisex'].map(gender => (
                                        <li key={gender}>
                                            <button onClick={(e) => handleNavClick(e, 'catalogue', gender)} className={`text-sm text-gray-500 hover:text-black transition-colors ${catalogueFilter?.type === 'gender' && catalogueFilter.value === gender ? 'text-black font-medium' : ''}`}>
                                                {gender}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu (Slide-in) */}
            <div className={`fixed inset-0 z-40 md:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>

                {/* Menu Content */}
                <div className={`fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? '-translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <header className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                            <IconButton onClick={() => setIsMobileMenuOpen(false)} ariaLabel="Close menu">
                                <CloseIcon className="w-6 h-6" />
                            </IconButton>
                        </header>
                        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                            <button onClick={(e) => handleNavClick(e, 'catalogue', null)} className="block w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium">All Products</button>
                             <Accordion title="Collections & Categories" theme="light">
                                <div className="pl-4 pt-2">
                                    {productCategories.map(group => (
                                        <div key={group.groupName}>
                                            {group.categories.length > 0 ? (
                                                <Accordion title={group.groupName} theme="light">
                                                    <ul className="pl-4 pt-2 space-y-1">
                                                        <li>
                                                            <button 
                                                                onClick={(e) => handleNavClick(e, 'catalogue', group.groupName)} 
                                                                className="w-full text-left py-1.5 text-gray-600 hover:text-black font-medium text-sm"
                                                            >
                                                                All {group.groupName}
                                                            </button>
                                                        </li>
                                                        {group.categories.map(category => (
                                                            <li key={category}>
                                                                <button 
                                                                    onClick={(e) => handleNavClick(e, 'catalogue', category)} 
                                                                    className="w-full text-left py-1.5 text-gray-600 hover:text-black text-sm"
                                                                >
                                                                    {category}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </Accordion>
                                            ) : (
                                                <div className="py-2 border-b border-gray-200">
                                                    <button 
                                                        onClick={(e) => handleNavClick(e, 'catalogue', group.groupName)}
                                                        className="w-full flex justify-between items-center text-left p-2"
                                                    >
                                                        <span className="uppercase tracking-wider text-sm font-semibold text-gray-800">{group.groupName}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                             </Accordion>
                            <Accordion title="Gender" theme="light">
                                <ul className="pl-4 pt-2">
                                    {['Men', 'Women', 'Unisex'].map(gender => (
                                        <li key={gender}>
                                            <button onClick={(e) => handleNavClick(e, 'catalogue', gender)} className="block w-full text-left py-2 text-gray-700 hover:text-black">
                                                {gender}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </Accordion>
                            <Accordion title="Explore" theme="light">
                                <ul className="pl-4 pt-2">
                                    {exploreLinks.map(link => {
                                        const linkContent = (
                                            <>
                                                <span>{link.label}</span>
                                                {(link as any).isLive && (
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                    </span>
                                                )}
                                            </>
                                        );
                                        return (
                                            <li key={link.label}>
                                                {(link as any).href ? (
                                                    <a
                                                        href={(link as any).href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between w-full text-left py-2 text-gray-700 hover:text-black"
                                                    >
                                                        {linkContent}
                                                    </a>
                                                ) : (
                                                    <button onClick={(e) => handleNavClick(e, (link as any).view!)} className="flex items-center justify-between w-full text-left py-2 text-gray-700 hover:text-black">
                                                        {linkContent}
                                                    </button>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Accordion>
                        </nav>
                        <div className="flex items-center justify-around p-4 border-t border-gray-200">
                             <IconButton onClick={handleSearchIconClick} ariaLabel="Search">
                                <SearchIcon className="w-7 h-7" />
                            </IconButton>
                            <IconButton onClick={() => { onSubscribeClick(); setIsMobileMenuOpen(false); }} ariaLabel="Subscribe to Newsletter">
                                <UserIcon className="w-7 h-7" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
