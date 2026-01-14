
import React from 'react';
import Button from './Button';
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
    onNavigate: (page: View, category?: string | null) => void;
    isFirst: boolean;
}

/**
 * @description A full-width hero section with a video background and text overlay.
 * It can be rendered as a primary or secondary hero with different styling.
 */
const Hero: React.FC<HeroProps> = ({ mediaSrc, mediaType, title, description, buttonText, buttonCollectionLink, onNavigate, isFirst }) => {
    // The main hero section fills the screen height but is capped for very large screens.
    // For subsequent heroes, a smaller height is better.
    const heroHeightClass = isFirst ? 'min-h-screen max-h-[960px]' : 'h-[70vh]';
    
    // Font sizes are smaller for a more refined look on the main hero banner.
    const titleSize = isFirst ? 'text-3xl md:text-4xl' : 'text-3xl md:text-4xl';
    const descriptionSize = isFirst ? 'text-base md:text-lg' : 'text-base md:text-lg';
    
    // Main hero text is positioned at the bottom-left; subsequent heroes are centered.
    const alignmentClass = isFirst ? 'flex items-end' : 'flex items-center';
    const paddingClass = isFirst ? 'pb-20 md:pb-24' : '';


    const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (buttonCollectionLink) {
            onNavigate('catalogue', buttonCollectionLink);
        }
    };

    return (
        <section className={`relative w-full ${heroHeightClass} overflow-hidden ${alignmentClass} ${!isFirst ? 'mt-8' : ''}`}>
            {/* Background media */}
            {mediaType === 'video' ? (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
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
            <div className="absolute inset-0 bg-black/40 z-0"></div>
            
            {/* Content overlay */}
            <div className={`relative z-10 w-full px-5 md:px-10 ${paddingClass}`}>
                <div className="max-w-md md:max-w-lg text-white">
                    <h1 className={`font-oswald ${titleSize} tracking-wider mb-3 uppercase animate-fade-in-up`}>{title}</h1>
                    <p className={`${descriptionSize} leading-relaxed mb-6 animate-fade-in-up [animation-delay:200ms]`}>{description}</p>
                    {buttonText && buttonCollectionLink && (
                        <Button href="#" onClick={handleButtonClick} className="animate-fade-in-up [animation-delay:400ms]">
                            {buttonText}
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;
