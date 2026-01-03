
import React, { useRef, useState, useEffect } from 'react';
import { View } from '../types';
import Button from './Button';
import { BriefcaseIcon, DesignIcon, PackagingIcon, PrintingIcon, ChatIcon, ProductionIcon, LogisticsIcon } from './icons';

const useOnScreen = (ref: React.RefObject<Element | null>, rootMargin: string = '0px 0px -150px 0px'): boolean => {
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

interface ServicePageProps {
    onNavigate: (page: View) => void;
}

const CoreService: React.FC<{
    title: string;
    description: string;
    imageUrl: string;
    includedItems: string[];
    reverse?: boolean;
}> = ({ title, description, imageUrl, includedItems, reverse = false }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);

    return (
        <div ref={ref} className="overflow-x-hidden">
            <div className={`flex flex-col md:flex-row items-center gap-10 lg:gap-16 ${reverse ? 'md:flex-row-reverse' : ''}`}>
                <div className={`w-full md:w-1/2 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${reverse ? 'translate-x-12' : '-translate-x-12'}`}`}>
                    <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-2xl">
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className={`w-full md:w-1/2 transition-all duration-700 ease-out delay-200 ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${reverse ? '-translate-x-12' : 'translate-x-12'}`}`}>
                    <div className="bg-white shadow-xl rounded-lg p-8 md:p-12">
                        <h2 className="font-heading text-3xl lg:text-4xl text-gray-900 mb-4 uppercase">{title}</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">{description}</p>
                        <ul className="space-y-2">
                            {includedItems.map(item => (
                                <li key={item} className="flex items-start p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <svg className="h-5 w-5 text-gray-800 mr-4 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-800 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProcessStep: React.FC<{
    icon: React.ReactNode;
    step: string;
    title: string;
    description: string;
    delay: number;
}> = ({ icon, step, title, description, delay }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    return (
        <div ref={ref} className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: `${delay}ms`}}>
            <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-100 text-[#3A3A3A] flex items-center justify-center border-4 border-white shadow-lg">
                    {icon}
                </div>
                <div>
                    <p className="font-bold text-sm text-gray-500 uppercase tracking-wider">{step}</p>
                    <h4 className="font-oswald text-2xl text-[#3A3A3A] mt-1 uppercase tracking-wide">{title}</h4>
                    <p className="text-gray-600 mt-3 leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
};

const AdditionalServiceCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number; }> = ({ icon, title, description, delay }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    return(
        <div ref={ref} className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: `${delay}ms`}}>
            <div className="bg-white rounded-lg shadow-lg p-8 h-full group text-center flex flex-col items-center border-2 border-transparent hover:border-black transition-all duration-300 hover:shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-[#3A3A3A] flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-[#3A3A3A] group-hover:text-white group-hover:scale-110 group-hover:-translate-y-1">
                    {icon}
                </div>
                <h4 className="font-oswald text-xl text-[#3A3A3A] uppercase tracking-wide mb-2">{title}</h4>
                <p className="text-sm text-gray-600 flex-grow">{description}</p>
            </div>
        </div>
    );
};


const ServicesPage: React.FC<ServicePageProps> = ({ onNavigate }) => {
    const processSteps = [
        { icon: <ChatIcon className="w-8 h-8"/>, step: "Step 01", title: "Consultation & Quote", description: "Your vision is our starting point. We collaborate with you to understand your needs, brand identity, and objectives, then provide a detailed quote and timeline." },
        { icon: <DesignIcon className="w-8 h-8"/>, step: "Step 02", title: "Design & Prototyping", description: "Our creative team translates your ideas into digital mockups. Upon request, we produce a physical sample to ensure every detail is perfect before full-scale production." },
        { icon: <ProductionIcon className="w-8 h-8"/>, step: "Step 03", title: "Crafting & Production", description: "With your approval, our skilled local artisans use premium materials and state-of-the-art technology to craft your order with meticulous attention to detail." },
        { icon: <LogisticsIcon className="w-8 h-8"/>, step: "Step 04", title: "Delivery & Fulfillment", description: "We carefully pack and dispatch your order through reliable couriers, ensuring it arrives safely, on time, and ready to make an impact." }
    ];

    const additionalServices = [
        { icon: <DesignIcon className="w-8 h-8"/>, title: "Graphic Design", description: "Build a cohesive brand identity with custom logos, marketing materials, and digital assets designed by our creative team." },
        { icon: <BriefcaseIcon className="w-8 h-8"/>, title: "Corporate Branding", description: "Elevate your corporate image with branded business cards, IDs, mugs, and other professional office essentials." },
        { icon: <PrintingIcon className="w-8 h-8"/>, title: "Specialized Printing", description: "High-quality solutions for various needs, including vinyl prints, large-format signage, and event marketing materials." },
        { icon: <PackagingIcon className="w-8 h-8"/>, title: "Custom Packaging", description: "Complete your product experience with custom-branded gift bags, boxes, and comprehensive packaging solutions." }
    ];

    return (
        <div className="bg-[#E0E0E0]">
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-gray-900 flex items-center justify-center">
                <img 
                    src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Apparel manufacturing process" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative text-center text-white p-4 z-10 animate-fade-in-up">
                    <h1 className="font-heading text-4xl md:text-6xl tracking-tight uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        End-to-End Custom Solutions
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>From concept to delivery, we are your dedicated partner in creating premium custom merchandise that defines your brand.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="space-y-20">
                    <CoreService
                        title="Performance Teamwear"
                        description="Give your team the winning edge with high-performance, fully customized apparel. We utilize professional-grade technical fabrics and precision printing methods to create gear that not only looks exceptional but also withstands the rigors of competition, fostering unity and pride."
                        imageUrl="https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        includedItems={['Official Game & Practice Kits', 'Coordinated Team Warm-Ups & Jackets', 'Performance Pants & Shorts', 'Branded Fan & Supporter Apparel']}
                    />
                    <CoreService
                        title="Corporate & Staff Uniforms"
                        description="Present a unified and professional front with our bespoke corporate apparel solutions. From comfortable office wear to durable event uniforms, we design and produce clothing that embodies your brand's values and ensures your team looks polished and cohesive."
                        imageUrl="https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        includedItems={['Embroidered Polo Shirts & Oxfords', 'Custom Staff Jackets & Vests', 'Branded Event T-Shirts', 'Durable Workwear & Aprons']}
                        reverse
                    />
                </div>

                {/* Our Process Section */}
                <div className="mt-24 pt-16 border-t border-gray-300">
                     <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl text-gray-900 mb-4 uppercase">Your Vision, Our Mission</h2>
                        <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                            We've refined our production into a seamless, collaborative journey to ensure your project is a success from start to finish.
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto grid grid-cols-1 gap-12">
                        {processSteps.map((step, index) => (
                            <ProcessStep key={step.title} {...step} delay={index * 150} />
                        ))}
                    </div>
                </div>
                
                {/* Beyond Apparel Section */}
                <div className="mt-24 pt-16 border-t border-gray-300">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl text-gray-900 mb-4 uppercase">Beyond the Uniform</h2>
                         <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                            We offer a complete branding suite to ensure your identity is consistent, professional, and impactful across all touchpoints.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {additionalServices.map((service, index) => (
                            <AdditionalServiceCard key={service.title} {...service} delay={index * 150} />
                        ))}
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="mt-24 text-center bg-gray-900 p-10 md:p-16 rounded-lg shadow-xl">
                    <h2 className="font-heading text-3xl text-white mb-4 uppercase">Ready to Build Your Brand's Legacy?</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                        Let's collaborate. Reach out to our specialists today for a personalized consultation and discover how we can elevate your brand's presence.
                    </p>
                    <Button 
                        variant="primary"
                        onClick={(e: React.MouseEvent) => { e.preventDefault(); onNavigate('contact'); }}
                        className="bg-white/90 text-black hover:bg-white"
                    >
                        Start Your Project
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
