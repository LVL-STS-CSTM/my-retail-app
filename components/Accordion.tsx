import React, { useState } from 'react';

/**
 * @interface AccordionProps
 * @description Props for the AccordionProps component.
 * @property {string} title - The text to be displayed in the clickable header of the accordion.
 * @property {React.ReactNode} children - The content to be revealed when the accordion is opened.
 * @property {'light' | 'dark'} theme - The color theme for the component.
 */
interface AccordionProps {
    title: string;
    children: React.ReactNode;
    theme?: 'light' | 'dark';
}

/**
 * @description A reusable accordion component for displaying collapsible content.
 * It manages its own open/closed state and supports light/dark themes.
 */
const Accordion: React.FC<AccordionProps> = ({ title, children, theme = 'light' }) => {
    // Local state to track whether the accordion panel is open or closed.
    // Changed to false to make accordions closed by default.
    const [isOpen, setIsOpen] = useState(false);
    const isDark = theme === 'dark';

    return (
        <div className={`py-2 ${isDark ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex justify-between items-center text-left p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black transition-colors ${
                    isDark
                        ? 'text-gray-200 hover:bg-gray-800'
                        : 'text-gray-800 hover:bg-gray-50'
                }`}
                aria-expanded={isOpen}
            >
                <span className={`flex-1 pr-2 uppercase tracking-wider text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{title}</span>
                <svg
                    className={`w-5 h-5 transform transition-transform duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {/* 
              This div uses a CSS grid trick for smooth animation.
              `grid-rows-[0fr]` collapses the content, and `grid-rows-[1fr]` expands it.
              The `transition` property on the `grid-template-rows` creates the animation.
            */}
            <div
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className={`pt-2 whitespace-pre-line ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;
