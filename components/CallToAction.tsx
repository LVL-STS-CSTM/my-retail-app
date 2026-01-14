import React, { useRef } from 'react';
import { View } from '../types';
import Button from './Button';
import { useOnScreen } from '../useOnScreen';

interface CallToActionProps {
    onNavigate: (page: View) => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onNavigate }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);
    
    return (
        <section ref={sectionRef} className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className={`font-oswald text-3xl text-[#3A3A3A] mb-4 uppercase tracking-wider transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Ready to Create Something Exceptional?</h2>
                <p className={`text-lg text-gray-600 mb-8 max-w-3xl mx-auto transition-all duration-700 ease-out delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Let's collaborate on your next project. Our team is ready to bring your vision to life with quality craftsmanship and unparalleled service.
                </p>
                <div className={`transition-all duration-700 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <Button 
                        variant="solid"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); onNavigate('contact'); }}
                    >
                        Start Your Project
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;