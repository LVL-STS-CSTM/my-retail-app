import React, { useRef, useState, useEffect } from 'react';
import { ChatIcon, DesignIcon, ProductionIcon, LogisticsIcon } from './icons';

const useOnScreen = (ref: React.RefObject<any>, rootMargin: string = '0px 0px -20% 0px'): boolean => {
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


const steps = [
    { icon: <ChatIcon className="w-10 h-10" />, title: "Consult & Quote", description: "Share your vision with our experts. We'll provide a detailed quote and roadmap for your project." },
    { icon: <DesignIcon className="w-10 h-10" />, title: "Design & Mockup", description: "Our designers create digital mockups. We'll refine them until they're perfect and get your final approval." },
    { icon: <ProductionIcon className="w-10 h-10" />, title: "Produce & Perfect", description: "Our skilled artisans use state-of-the-art technology to bring your design to life with meticulous attention to detail." },
    { icon: <LogisticsIcon className="w-10 h-10" />, title: "Deliver & Delight", description: "We conduct a final quality check, then package and ship your order, ensuring it arrives safely and on time." }
];

const HowItWorks: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    return (
        <section ref={sectionRef} className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className={`font-oswald text-3xl md:text-4xl text-gray-900 mb-4 uppercase tracking-wider transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>How It Works</h2>
                    <p className={`text-lg text-gray-600 max-w-3xl mx-auto transition-all duration-700 ease-out delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>A simple, transparent process from concept to delivery.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {steps.map((step, index) => (
                        <div 
                            key={step.title}
                            className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center border-4 border-white shadow-lg">
                                {step.icon}
                            </div>
                            <h3 className="font-oswald text-xl text-gray-800 uppercase tracking-wide">{step.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;