
import React, { useRef, useState, useEffect } from 'react';

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

const techniques = [
    { title: "Screen Printing", description: "Ideal for bold, vibrant designs on a large volume of garments.", imageUrl: "https://images.pexels.com/photos/7679863/pexels-photo-7679863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Embroidery", description: "Offers a premium, textured, and highly durable finish for logos and text.", imageUrl: "https://images.pexels.com/photos/8148600/pexels-photo-8148600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Full Sublimation", description: "Allows for all-over, photorealistic prints that never crack, peel, or fade.", imageUrl: "https://images.pexels.com/photos/6958514/pexels-photo-6958514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Direct-to-Film (DTF)", description: "A versatile method for detailed, full-color graphics on a wide range of fabrics.", imageUrl: "https://images.pexels.com/photos/11115895/pexels-photo-11115895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }
];

const CustomizationShowcase: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    return (
        <section ref={sectionRef} className="bg-[#3A3A3A] text-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className={`font-oswald text-3xl md:text-4xl mb-4 uppercase tracking-wider transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>Our Customization Capabilities</h2>
                    <p className={`text-lg text-gray-300 max-w-3xl mx-auto transition-all duration-700 ease-out delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>We utilize a range of cutting-edge techniques to bring your vision to life with precision and quality.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {techniques.map((tech, index) => (
                        <div 
                            key={tech.title} 
                            className={`group relative overflow-hidden rounded-lg shadow-xl transform transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <img src={tech.imageUrl} alt={tech.title} className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:bg-black/70 transition-colors duration-300"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="font-oswald text-xl uppercase tracking-wider">{tech.title}</h3>
                                <p className="text-sm text-gray-300 mt-2 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out">{tech.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomizationShowcase;
