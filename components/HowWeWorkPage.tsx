import React from 'react';
import { useData } from '../context/DataContext';

const HowWeWorkPage: React.FC = () => {
    const { howWeWorkSections } = useData();

    return (
        <div className="bg-[#E0E0E0]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="font-heading text-4xl md:text-5xl tracking-tight text-gray-900 mb-6 uppercase">
                        HOW WE WORK
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-16 max-w-3xl mx-auto">
                        Every LEVEL CUSTOMS APPAREL design is rooted in years of experience as athletes and individuals who live and breathe an active lifestyle.
                    </p>
                </div>
                
                <div className="space-y-20">
                    {howWeWorkSections.map((section, index) => (
                        <div key={section.id} className={`flex flex-col md:flex-row items-center gap-10 lg:gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            {/* Image Column */}
                            <div className="w-full md:w-1/2">
                                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-lg">
                                    <img 
                                        src={section.imageUrl} 
                                        alt={section.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            </div>
                            
                            {/* Text Column */}
                            <div className="w-full md:w-1/2">
                                <h3 className="font-heading text-2xl lg:text-3xl text-gray-800 mb-4 uppercase">{section.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {section.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowWeWorkPage;