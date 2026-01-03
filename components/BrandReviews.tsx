import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { BrandReview, PlatformRating } from '../types';
import { StarIcon, QuoteIcon, GoogleGIcon, FacebookIcon, YelpIcon, TrustpilotIcon, LinkedinIcon } from './icons';

const useOnScreen = (ref: React.RefObject<any>, rootMargin: string = '0px 0px -150px 0px'): boolean => {
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

interface BrandReviewsProps {
    brandReviews: BrandReview[];
    platformRatings: PlatformRating[];
}

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const BrandReviews: React.FC<BrandReviewsProps> = ({ brandReviews, platformRatings }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const visibleReviews = useMemo(() => brandReviews.filter(review => review.isVisible), [brandReviews]);
    const visiblePlatformRatings = useMemo(() => platformRatings.filter(rating => rating.isVisible), [platformRatings]);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        resetTimeout();
        if (!isPaused && visibleReviews.length > 1) {
            timeoutRef.current = setTimeout(
                () => setCurrentIndex((prevIndex) => (prevIndex === visibleReviews.length - 1 ? 0 : prevIndex + 1)),
                5000 // Change slide every 5 seconds
            );
        }
        return () => {
            resetTimeout();
        };
    }, [currentIndex, isPaused, visibleReviews.length, resetTimeout]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? visibleReviews.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === visibleReviews.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (visibleReviews.length === 0 && visiblePlatformRatings.length === 0) {
        return null;
    }

    return (
        <section ref={ref} className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-center transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    <h2 className="font-oswald text-3xl md:text-4xl tracking-tight text-gray-900 mb-4 uppercase">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
                        Real results and reviews from our valued partners.
                    </p>
                </div>
                
                {visiblePlatformRatings.length > 0 && (
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {visiblePlatformRatings.map((rating, index) => (
                            <div 
                                key={rating.id}
                                className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                style={{ transitionDelay: `${200 + index * 150}ms` }}
                            >
                                <a 
                                    href={rating.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full"
                                >
                                    <div className="flex-shrink-0">
                                        {rating.platform === 'Google' && <GoogleGIcon className="w-12 h-12" />}
                                        {rating.platform === 'Facebook' && <FacebookIcon className="w-12 h-12 text-[#1877F2]" />}
                                        {rating.platform === 'Yelp' && <YelpIcon className="w-12 h-12 text-[#d32323]" />}
                                        {rating.platform === 'Trustpilot' && <TrustpilotIcon className="w-12 h-12 text-[#00b67a]" />}
                                        {rating.platform === 'LinkedIn' && <LinkedinIcon className="w-12 h-12 text-[#0077b5]" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{rating.platform}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-lg font-bold text-gray-800">{rating.rating.toFixed(1)}</span>
                                            <div className="flex items-center">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(rating.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1">Based on {rating.reviewCount.toLocaleString()} reviews</p>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {visibleReviews.length > 0 && (
                    <div
                        className="relative max-w-4xl mx-auto"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="overflow-hidden relative min-h-[340px] sm:min-h-[300px]">
                            {visibleReviews.map((review, index) => (
                                <div
                                    key={review.id}
                                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                                    style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 10 : 0 }}
                                >
                                    <div className="bg-gray-50 p-8 md:p-12 rounded-lg text-center flex flex-col items-center border border-gray-100 h-full shadow-lg">
                                        <img
                                            className="w-20 h-20 rounded-full mb-6 object-cover shadow-md"
                                            src={review.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=random`}
                                            alt={`A custom product reviewed by ${review.author}`}
                                        />
                                        <div className="flex-grow flex flex-col justify-center">
                                          <blockquote className="text-gray-700 italic text-lg mb-6">"{review.quote}"</blockquote>
                                          <div className="flex items-center justify-center mb-4">
                                              {Array.from({ length: 5 }).map((_, i) => (
                                                  <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                              ))}
                                          </div>
                                          <cite className="font-semibold text-gray-900 not-italic">{review.author}</cite>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {visibleReviews.length > 1 && (
                            <>
                                <button onClick={goToPrevious} className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all z-20 hidden md:block">
                                    <ChevronLeftIcon />
                                </button>
                                <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all z-20 hidden md:block">
                                    <ChevronRightIcon />
                                </button>
                                <div className="flex justify-center mt-6 space-x-2">
                                    {visibleReviews.map((_, slideIndex) => (
                                        <button
                                            key={slideIndex}
                                            onClick={() => goToSlide(slideIndex)}
                                            className={`h-2 w-2 rounded-full transition-colors ${currentIndex === slideIndex ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'}`}
                                            aria-label={`Go to slide ${slideIndex + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BrandReviews;