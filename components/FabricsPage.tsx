import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Material } from '../types';
import MaterialCareModal from './MaterialCareModal';

const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin: string = '0px 0px -150px 0px'): boolean => {
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

const MaterialSection: React.FC<{ material: Material; index: number; openCareModal: (url?: string) => void }> = ({ material, index, openCareModal }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);

    return (
        <div 
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
            <div className={`flex flex-col md:flex-row items-center gap-10 lg:gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                        <img src={material.imageUrl} alt={material.name} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <h3 className="font-heading text-2xl lg:text-3xl text-gray-800 mb-4 uppercase">{material.name}</h3>
                    <div className="flex flex-wrap gap-2 my-4">
                        {material.features.map((feature: string) => (
                            <span key={feature} className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200">{feature}</span>
                        ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">{material.description}</p>
                    <button
                        onClick={() => openCareModal(material.careImageUrl)}
                        className="inline-block bg-[#3A3A3A] text-white py-2 px-5 text-sm font-semibold rounded-md transition-all duration-300 ease-out hover:bg-black hover:shadow-md"
                    >
                        View Material Care
                    </button>
                </div>
            </div>
        </div>
    );
};


const MaterialsPage: React.FC = () => {
    const { materials } = useData();
    const [isCareModalOpen, setIsCareModalOpen] = useState(false);
    const [selectedCareImage, setSelectedCareImage] = useState<string | undefined>(undefined);

    const openCareModal = (imageUrl?: string) => {
        setSelectedCareImage(imageUrl);
        setIsCareModalOpen(true);
    };

    const closeCareModal = () => {
        setIsCareModalOpen(false);
        setSelectedCareImage(undefined);
    };


    return (
        <>
            <div className="bg-[#E0E0E0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="font-heading text-4xl md:text-5xl tracking-tight text-gray-900 mb-6 uppercase">
                            Our Signature Materials
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed mb-20 max-w-3xl mx-auto">
                            Quality is woven into everything we do. We meticulously source and develop technical materials that deliver superior performance, comfort, and durability, providing the perfect canvas for your brand.
                        </p>
                    </div>
                    
                    <div className="space-y-20">
                        {materials.map((material, index) => (
                           <MaterialSection key={material.id} material={material} index={index} openCareModal={openCareModal} />
                        ))}
                    </div>

                    {/* Production Methods Section */}
                    <section className="mt-24 pt-16 border-t border-gray-300">
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
                            {/* Left Column */}
                            <div className="relative flex items-center justify-center p-8 bg-gray-800 min-h-[300px] md:min-h-full">
                                <img 
                                    src="https://images.pexels.com/photos/6608304/pexels-photo-6608304.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                                    alt="Fabric printing production"
                                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                                />
                                <h2 className="relative font-heading text-5xl md:text-6xl text-white tracking-wider uppercase text-center">
                                    Production Methods
                                </h2>
                            </div>
                            {/* Right Column */}
                            <div className="p-8 md:p-12 flex flex-col justify-center space-y-10 bg-gray-50">
                                <div>
                                    <h3 className="font-heading text-3xl text-gray-900 uppercase">Hybrid</h3>
                                    <p className="font-semibold text-gray-500 mt-1 uppercase text-sm tracking-wider">Mixed Sublimation &amp; Other Printing Methods</p>
                                    <p className="mt-4 text-gray-700 leading-relaxed text-base">
                                        HYBRID combines printing methods including accent sublimation for precise placement of designs whether on collars, sleeves, and side panels, plus over-fabric prints (OFP) for added standout texture. These jerseys can handle sweat and keep their colors bright, wash after wash. Your whole team gets durable uniforms that last, with colors that stay looking fresh through every game.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-heading text-3xl text-gray-900 uppercase">Hybrid Pro</h3>
                                    <p className="font-semibold text-gray-500 mt-1 uppercase text-sm tracking-wider">Full Sublimation with Over Fabric Prints</p>
                                    <p className="mt-4 text-gray-700 leading-relaxed text-base">
                                        HYBRID PRO takes our advanced printing method a step further—with full sublimation that covers the entire jersey in bold, seamless graphics combined with striking over-fabric prints (OFP). The colors bond permanently with the fabric, staying crisp and vibrant no matter how much you sweat. Unlike regular printing that peels or fades, our jerseys keep looking fresh through countless games while delivering comfort and confidence to your team.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <MaterialCareModal 
                isOpen={isCareModalOpen}
                onClose={closeCareModal}
                imageUrl={selectedCareImage}
            />
        </>
    );
};

export default MaterialsPage;