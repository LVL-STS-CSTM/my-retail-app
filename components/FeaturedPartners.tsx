
import React, { useRef, useState, useEffect } from 'react';
import { Partner } from '../types';

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

interface FeaturedPartnersProps {
    partners: Partner[];
}

const FeaturedPartners: React.FC<FeaturedPartnersProps> = ({ partners }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);

    if (!partners || partners.length === 0) {
        return null;
    }

    return (
        <section ref={ref} className="bg-gray-100 py-16 md:py-24">
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="text-center">
                    <h2 className="font-oswald text-3xl md:text-4xl tracking-tight text-gray-900 mb-4 uppercase">
                        Trusted By
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
                        We're proud to collaborate with brands of all sizes, from innovative startups to global icons.
                    </p>
                </div>
            </div>
            <div className="mt-12 w-full overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12">
                        {partners.map((partner) => (
                            <li key={partner.id}>
                                <img src={partner.logoUrl} alt={`${partner.name} logo`} className="max-h-14 w-auto" />
                            </li>
                        ))}
                    </ul>
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12" aria-hidden="true">
                        {partners.map((partner) => (
                            <li key={`${partner.id}-clone`}>
                                <img src={partner.logoUrl} alt={`${partner.name} logo`} className="max-h-14 w-auto" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default FeaturedPartners;
