
import React from 'react';
import { View } from '../types';

/**
 * @interface HeroProps
 * @description Props for the Hero component.
 */
interface HeroProps {
    mediaSrc: string;
    mediaType: 'video' | 'image' | 'gif';
    title: string;
    description: string;
    buttonText?: string;
    buttonCollectionLink?: string;
    onNavigate: (page: View | string, filterValue?: string | null) => void;
    isFirst: boolean;
}

/**
 * @description A full-width hero section with a video background and text overlay.
 * It can be rendered as a primary or secondary hero with different styling.
 */
const Hero: React.FC<HeroProps> = ({ mediaSrc, mediaType, title, description, buttonText, buttonCollectionLink, onNavigate, isFirst }) => {
    const heroHeightClass = isFirst ? 'min-h-screen max-h-[960px]' : 'h-[70vh]';
    const titleSize = isFirst ? 'text-3xl md:text-4xl' : 'text-3xl md:text-4xl';
    const descriptionSize = isFirst ? 'text-base md:text-lg' : 'text-base md:text-lg';
    const alignmentClass = isFirst ? 'flex items-end' : 'flex items-center';
    const paddingClass = isFirst ? 'pb-20 md:pb-24' : '';

    const handleNavigation = () => {
        if (buttonCollectionLink) {
            onNavigate('catalogue', buttonCollectionLink);
        }
    };

    // The entire section is clickable if a link is provided.
    const isClickable = !!buttonCollectionLink;

    return (
        <section
            role={isClickable ? "link" : undefined}
            aria-label={isClickable ? `Navigate to ${title} collection` : undefined}
            onClick={isClickable ? handleNavigation : undefined}
            className={`relative w-full ${heroHeightClass} overflow-hidden ${alignmentClass} ${!isFirst ? 'mt-8' : ''} ${isClickable ? 'cursor-pointer group' : ''}`}
        >
            {/* Background media */}
            {mediaType === 'video' ? (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    key={mediaSrc} // Ensure video re-renders on src change
                >
                    <source src={mediaSrc} type="video/mp4" />
                </video>
            ) : (
                <img
                    src={mediaSrc}
                    alt={title}
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                />
            )}
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 z-0 transition-colors duration-300 group-hover:bg-black/50"></div>
            
            {/* Content overlay */}
            <div className={`relative z-10 w-full px-5 md:px-10 ${paddingClass}`}>
                <div className="max-w-md md:max-w-lg text-white">
                    <h1 className={`font-oswald ${titleSize} tracking-wider mb-3 uppercase animate-fade-in-up`}>{title}</h1>
                    <p className={`${descriptionSize} leading-relaxed mb-6 animate-fade-in-up [animation-delay:200ms]`}>{description}</p>
                    {/* The button is now a visual indicator within the clickable section */}
                    {buttonText && isClickable && (
                        <div className="inline-block bg-white text-black font-bold uppercase tracking-wider py-3 px-8 rounded-sm animate-fade-in-up [animation-delay:400ms] transition-colors duration-300 group-hover:bg-gray-200">
                            {buttonText}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;
