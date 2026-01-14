import React from 'react';

// Define props that are common to both button and anchor
interface CommonProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'solid' | 'light' | 'secondary';
}

// Define props specific to each element type, making them optional.
// This allows for props like 'type' on button and 'href' on anchor.
type ButtonSpecificProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorSpecificProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

// Combine them into a single polymorphic type
export type ButtonProps = CommonProps & (ButtonSpecificProps | AnchorSpecificProps);

/**
 * @description A reusable, styled button component that renders as an `<a>` if an `href` prop is provided,
 * otherwise it renders a `<button>`. It supports multiple visual variants for consistency across the application.
 */
const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
    // Defines the core layout and interaction styles of the button.
    const baseClasses = "inline-block py-2.5 px-6 text-sm md:py-3 md:px-8 md:text-base uppercase font-semibold rounded-md shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 tracking-widest no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg text-center";
    
    // Defines styles for different visual variants.
    const primaryClasses = "bg-white/20 text-white border border-white/40 backdrop-blur-md hover:bg-white/30 focus-visible:outline-white"; // For hero/transparent backgrounds
    const solidClasses = "bg-[#3A3A3A] text-white border border-transparent hover:bg-[#2a2a2a] focus-visible:outline-[#3A3A3A]"; // Primary CTA
    const lightClasses = "bg-white text-[#3A3A3A] border border-gray-300 hover:bg-gray-100 shadow-md focus-visible:outline-[#3A3A3A]"; // CTA on light backgrounds
    const secondaryClasses = "bg-gray-200 text-gray-800 border border-transparent hover:bg-gray-300 shadow-sm focus-visible:outline-gray-500 font-medium"; // Less prominent actions
    
    let variantClasses = '';
    switch (variant) {
        case 'solid': variantClasses = solidClasses; break;
        case 'light': variantClasses = lightClasses; break;
        case 'secondary': variantClasses = secondaryClasses; break;
        default: variantClasses = primaryClasses;
    }

    const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

    // Render as an anchor tag if 'href' is present
    if ('href' in props && props.href) {
        return (
            <a {...(props as AnchorSpecificProps)} className={combinedClasses}>
                {children}
            </a>
        );
    }

    // Otherwise, render as a button
    return (
        <button {...(props as ButtonSpecificProps)} className={combinedClasses}>
            {children}
        </button>
    );
};

export default Button;