
import React, { useRef, useState, useEffect } from 'react';
import { SparklesIcon, ChatIcon, LocationPinIcon, StarIcon } from './icons';

const useOnScreen = (ref: React.RefObject<Element | null>, rootMargin: string = '0px 0px -20% 0px'): boolean => {
    const [isIntersecting, setIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIntersecting(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin }
        );
        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, rootMargin]);
    return isIntersecting;
};

const features = [
    {
        icon: <SparklesIcon className="w-10 h-10" />,
        title: "Premium Quality",
        description: "We source only the finest materials and employ meticulous craftsmanship to ensure every product is durable, comfortable, and flawlessly finished."
    },
    {
        icon: <ChatIcon className="w-10 h-10" />,
        title: "Expert Consultation",
        description: "Our dedicated team works closely with you from concept to completion, providing expert guidance to bring your unique vision to life."
    },
    {
        icon: <LocationPinIcon className="w-10 h-10" />,
        title: "Local Production",
        description: "By keeping our production in-house, we support local artisans, ensure higher quality control, and offer faster turnaround times."
    },
    {
        icon: <StarIcon className="w-10 h-10" />,
        title: "Proven Track Record",
        description: "Trusted by industry leaders and innovative startups alike, we have a proven history of delivering exceptional results on time."
    }
];

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; isVisible: boolean; delay: number; }> = ({ icon, title, description, isVisible, delay }) => {
    return (
        <div className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>
            <div className="bg-white p-8 rounded-lg shadow-lg h-full text-center flex flex-col items-center">
                <div className="mb-5 w-20 h-20 rounded-full bg-gray-800 text-white flex items-center justify-center">
                    {icon}
                </div>
                <h3 className="font-oswald text-xl text-gray-900 uppercase tracking-wide">{title}</h3>
                <p className="mt-3 text-sm text-gray-600 flex-grow">{description}</p>
            </div>
        </div>
    );
};

const WhyChooseUs: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    return (
        <section ref={sectionRef} className="bg-gray-100 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className={`font-oswald text-3xl md:text-4xl text-gray-900 mb-4 uppercase tracking-wider transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>Why Choose Level Customs?</h2>
                    <p className={`text-lg text-gray-600 max-w-3xl mx-auto transition-all duration-700 ease-out delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>Your trusted partner for premium, locally-crafted custom apparel.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} isVisible={isVisible} delay={index * 150} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
