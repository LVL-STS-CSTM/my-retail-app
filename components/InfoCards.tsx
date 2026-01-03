
import React, { useRef, useState, useEffect } from 'react';
import { InfoCard } from '../types';

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

interface InfoCardsProps {
    cards: InfoCard[];
    onCardClick: (card: InfoCard) => void;
}

const InfoCards: React.FC<InfoCardsProps> = ({ cards, onCardClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);

    // Sort the cards to ensure a consistent order: pursuit, newsletter, fabric
    const sortedCards = cards.sort((a, b) => {
        const order = ['pursuit', 'newsletter', 'fabric'];
        return order.indexOf(a.id) - order.indexOf(b.id);
    });

    return (
        <section className="max-w-[1840px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-12 overflow-hidden md:overflow-visible">
            <div ref={ref} className="md:grid md:grid-cols-3 md:gap-2.5 flex overflow-x-auto snap-x snap-mandatory gap-2.5 no-scrollbar -mx-2 sm:-mx-4 md:mx-0 px-2 sm:px-4 md:px-0">
                {sortedCards.map((card, index) => (
                    <div 
                        key={card.id}
                        className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} flex-shrink-0 w-[90vw] sm:w-[80vw] md:w-auto snap-center`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                        <button 
                            onClick={() => onCardClick(card)}
                            className="relative group aspect-square md:aspect-[3/4] overflow-hidden bg-cover bg-center text-white flex items-center justify-center text-center w-full rounded-lg"
                            style={{ backgroundImage: `url(${card.imageUrl})` }}
                            aria-label={card.title.replace('\n', ' ')}
                        >
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                            <h2 
                                className="relative font-oswald text-2xl md:text-3xl tracking-wider uppercase whitespace-pre-line transform group-hover:scale-105 transition-transform duration-300"
                                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                            >
                                {card.title}
                            </h2>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InfoCards;
