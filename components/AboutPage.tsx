import React, { useRef, useState, useEffect } from 'react';
import { View } from '../types';
import Button from './Button';
import { ChatIcon, DesignIcon, ProductionIcon, LogisticsIcon, BriefcaseIcon, SparklesIcon, SustainabilityIcon, SampleTestingIcon, EyeIcon, TargetIcon } from './icons';

const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin: string = '0px 0px -20% 0px'): boolean => {
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

interface AboutPageProps {
    onNavigate: (page: View, value?: string | null) => void;
}

const ProcessStep: React.FC<{
    icon: React.ReactNode;
    step: number;
    title: string;
    description: string;
    isVisible: boolean;
    delay: number;
}> = ({ icon, step, title, description, isVisible, delay }) => (
    <div className={`relative pl-24 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${delay}ms`}}>
        {/* Timeline line */}
        <div className="absolute left-[38px] top-1 h-full w-0.5 bg-gray-300"></div>
        {/* Icon container on the timeline */}
        <div className="absolute left-0 top-0 w-20 h-20 rounded-full bg-gray-100 text-[#3A3A3A] flex items-center justify-center border-4 border-[#E0E0E0] shadow-lg">
            {icon}
        </div>
        {/* Content */}
        <div>
            <p className="font-bold text-xs text-gray-500 uppercase tracking-wider">Step {step}</p>
            <h4 className="font-oswald text-2xl text-[#3A3A3A] mt-0.5 uppercase tracking-wide">{title}</h4>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
);


const ValueCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number; isVisible: boolean }> = ({ icon, title, children, delay, isVisible }) => (
    <div 
        className={`bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg text-white transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        style={{ transitionDelay: `${delay}ms` }}
    >
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center mb-4">
            {icon}
        </div>
        <h4 className="font-semibold text-lg text-white mb-2">{title}</h4>
        <p className="text-sm text-gray-300">{children}</p>
    </div>
);

const TeamMemberCard: React.FC<{ name: string; title: string; imageUrl: string; bio: string; isVisible: boolean; delay: number; }> = ({ name, title, imageUrl, bio, isVisible, delay }) => (
    <div 
        className={`bg-white text-center p-6 rounded-lg shadow-lg transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        style={{ transitionDelay: `${delay}ms` }}
    >
        <img src={imageUrl} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md"/>
        <h4 className="font-oswald text-xl text-gray-900 uppercase tracking-wide">{name}</h4>
        <p className="text-sm text-indigo-600 font-semibold mb-2">{title}</p>
        <p className="text-xs text-gray-600">{bio}</p>
    </div>
);


const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    const sectionRefs = {
        about: useRef<HTMLDivElement>(null),
        missionVision: useRef<HTMLDivElement>(null),
        values: useRef<HTMLDivElement>(null),
        team: useRef<HTMLDivElement>(null),
        process: useRef<HTMLDivElement>(null),
        cta: useRef<HTMLDivElement>(null),
    };
    
    const visibility = {
        about: useOnScreen(sectionRefs.about),
        missionVision: useOnScreen(sectionRefs.missionVision),
        values: useOnScreen(sectionRefs.values),
        team: useOnScreen(sectionRefs.team),
        process: useOnScreen(sectionRefs.process),
        cta: useOnScreen(sectionRefs.cta),
    };
    
    const processSteps = [
        { icon: <ChatIcon className="w-8 h-8"/>, step: 1, title: "Consultation", description: "It all starts with your vision. Reach out to us with your ideas, and our team will work with you to understand your needs, brand, and objectives. Send high-resolution logo references to levelcustomapparel@gmail.com to begin." },
        { icon: <BriefcaseIcon className="w-8 h-8"/>, step: 2, title: "Quotation & Planning", description: "Based on our consultation, we’ll provide a detailed quotation and a project timeline. We believe in transparency, so every cost will be clearly outlined for your approval before we proceed." },
        { icon: <DesignIcon className="w-8 h-8"/>, step: 3, title: "Design & Prototyping", description: "Our design team brings your concept to life. We’ll create digital mockups for your review and, upon request, produce a physical sample to ensure every detail is perfect before full production begins. A design fee must be settled before we begin." },
        { icon: <ProductionIcon className="w-8 h-8"/>, step: 4, title: "Craft & Production", description: "With your final approval and a 50% downpayment, our skilled local artisans get to work. We use state-of-the-art technology and meticulous craftsmanship to produce your order, with a standard lead time of 2–3 weeks." },
        { icon: <LogisticsIcon className="w-8 h-8"/>, step: 5, title: "Delivery", description: "Once production is complete and the final balance is settled, we carefully pack and dispatch your order. We partner with reliable couriers to ensure your custom apparel arrives safely and on time." }
    ];

    const teamMembers = [
        { name: 'J. Dela Cruz', title: 'Founder & CEO', imageUrl: 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=800', bio: 'The visionary behind Level Customs, driving the mission to make premium custom apparel accessible to all.' },
        { name: 'Maria Santos', title: 'Head of Design', imageUrl: 'https://images.pexels.com/photos/3775131/pexels-photo-3775131.jpeg?auto=compress&cs=tinysrgb&w=800', bio: 'Fusing creativity with functionality, Maria leads the design team to create apparel that performs as well as it looks.' },
        { name: 'Leo Reyes', title: 'Production Lead', imageUrl: 'https://images.pexels.com/photos/845457/pexels-photo-845457.jpeg?auto=compress&cs=tinysrgb&w=800', bio: 'With an obsessive eye for detail, Leo ensures that every garment leaving our facility meets the highest standards of quality.' }
    ];

    return (
        <div className="bg-[#E0E0E0] text-[#3A3A3A] overflow-x-hidden">
            <section className="relative bg-gray-900 text-white py-20 md:py-32 text-center flex items-center justify-center">
                <img 
                    src="https://images.pexels.com/photos/8365691/pexels-photo-8365691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Design studio workspace for custom apparel" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#3A3A3A]/70"></div>
                <div className="relative z-10 animate-fade-in-up">
                    <h1 className="font-heading text-5xl md:text-7xl tracking-tight uppercase">About Level</h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-200">Crafting Quality. Championing Local.</p>
                </div>
            </section>

            <section ref={sectionRefs.about} className={`py-16 md:py-24 px-4 bg-white`}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className={`transition-all duration-700 ease-out ${visibility.about ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <h2 className="font-heading text-3xl md:text-4xl text-gray-900 mb-6 uppercase">Our Story</h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p>Level is a proudly Filipino brand that creates custom clothing — crafted for teams, businesses, and everyday people who believe quality shouldn’t come with an outrageous price tag.</p>
                            <p>From game-day jerseys to work polos and daily tees, every piece is designed, printed, and sewn by skilled local hands that take pride in every detail. No shortcuts. No overpriced fluff. Just honest, hardwearing apparel that feels right, fits well, and looks even better.</p>
                            <p>We carry the spirit of Filipino craftsmanship in every stitch as we believe locals can lead, and we’re here to prove it.</p>
                        </div>
                    </div>
                    <div className={`transition-all duration-700 ease-out delay-200 ${visibility.about ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="aspect-w-1 aspect-h-1">
                            <img src="https://images.pexels.com/photos/5699865/pexels-photo-5699865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Close up of high-quality fabric" className="w-full h-full object-cover rounded-lg shadow-xl"/>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={sectionRefs.missionVision} className={`py-16 md:py-24 px-4 bg-gray-200`}>
                 <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`bg-white p-8 rounded-lg shadow-lg flex flex-col transition-all duration-700 ease-out ${visibility.missionVision ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <TargetIcon className="w-10 h-10 text-gray-800 flex-shrink-0"/>
                            <h2 className="font-heading text-3xl text-gray-900 uppercase">Our Mission</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">To empower Filipinos by making high-quality, custom apparel accessible—because looking good, feeling proud, and representing who you are shouldn’t come at a high cost. At LEVEL, we believe excellence doesn’t have to be expensive. Through honest pricing, skilled local craftsmanship, and thoughtful design, we make clothing every Filipino can wear with pride.</p>
                    </div>
                     <div className={`bg-white p-8 rounded-lg shadow-lg flex flex-col transition-all duration-700 ease-out delay-200 ${visibility.missionVision ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <EyeIcon className="w-10 h-10 text-gray-800 flex-shrink-0"/>
                            <h2 className="font-heading text-3xl text-gray-900 uppercase">Our Vision</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">To become the most trusted Filipino-made custom apparel brand—where quality, affordability, and national pride meet. We envision a future where every team, big or small, can wear premium uniforms that reflect their spirit, without breaking the bank. By championing local artisans and ethical pricing, we aim to redefine the game through every piece we create and every Filipino we proudly represent.</p>
                    </div>
                </div>
            </section>

            <section ref={sectionRefs.values} className="py-16 md:py-24 px-4 bg-[#3A3A3A]">
                 <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl text-white mb-4 uppercase">Our Core Values</h2>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">The principles that guide every decision we make.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ValueCard icon={<SampleTestingIcon className="w-6 h-6"/>} title="Unmatched Craftsmanship" delay={0} isVisible={visibility.values}>We obsess over every detail, from fabric selection to the final stitch, ensuring a premium product every time.</ValueCard>
                        <ValueCard icon={<BriefcaseIcon className="w-6 h-6"/>} title="Client-First Partnership" delay={150} isVisible={visibility.values}>Your vision is our mission. We work collaboratively with you to ensure your goals are met and expectations are exceeded.</ValueCard>
                        <ValueCard icon={<SustainabilityIcon className="w-6 h-6"/>} title="Integrity & Honesty" delay={300} isVisible={visibility.values}>We believe in transparent pricing and ethical practices, building relationships founded on trust and respect.</ValueCard>
                        <ValueCard icon={<SparklesIcon className="w-6 h-6"/>} title="Continuous Innovation" delay={450} isVisible={visibility.values}>We constantly explore new materials, techniques, and designs to stay at the forefront of the industry.</ValueCard>
                    </div>
                </div>
            </section>

            <section ref={sectionRefs.team} className={`py-16 md:py-24 px-4 bg-white`}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl text-gray-900 mb-4 uppercase">Meet the Leadership</h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">The driving force behind our commitment to quality and innovation.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <TeamMemberCard key={member.name} {...member} isVisible={visibility.team} delay={index * 150} />
                        ))}
                    </div>
                </div>
            </section>
            
            <div ref={sectionRefs.process} className={`py-16 px-4 bg-[#E0E0E0]`}>
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl text-[#3A3A3A] mb-4 uppercase">Our 5-Step Process</h2>
                        <p className="text-lg text-gray-600">A streamlined journey from concept to delivery, ensuring clarity and quality at every stage.</p>
                    </div>
                    <div className="space-y-16">
                        {processSteps.map((step, index) => (
                             <ProcessStep
                                key={step.step}
                                {...step}
                                isVisible={visibility.process}
                                delay={index * 200}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <section ref={sectionRefs.cta} className={`py-16 md:py-24 px-4 bg-white transition-all duration-700 ease-out ${visibility.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="font-heading text-3xl text-[#3A3A3A] mb-4 uppercase">Ready to Level Up Your Brand?</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Explore our full range of customizable products and let's start creating something exceptional together.</p>
                    <Button 
                        variant="solid"
                        onClick={(e) => { e.preventDefault(); onNavigate('catalogue'); }}
                    >
                        View Full Catalogue
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;