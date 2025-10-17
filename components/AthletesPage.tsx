import React from 'react';
import { useData } from '../context/DataContext';
import { Athlete } from '../types';
import { InstagramIcon } from './icons';

const AthleteCard: React.FC<{ athlete: Athlete }> = ({ athlete }) => {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg shadow-lg">
            <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                <img
                    src={athlete.imageUrl}
                    alt={`Portrait of ${athlete.name}`}
                    className="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative mt-auto flex flex-col p-6 text-white z-10">
                <h3 className="font-heading text-2xl uppercase tracking-wider">{athlete.name}</h3>
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-300">{athlete.sport}</p>
                <p className="mt-4 text-sm leading-relaxed opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-h-0 group-hover:max-h-40 overflow-hidden">
                    {athlete.bio}
                </p>
                {athlete.instagramHandle && (
                    <a
                        href={`https://www.instagram.com/${athlete.instagramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center gap-2 text-sm text-gray-200 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:text-white"
                        aria-label={`Follow ${athlete.name} on Instagram`}
                    >
                        <InstagramIcon />
                        <span>@{athlete.instagramHandle}</span>
                    </a>
                )}
            </div>
        </div>
    );
};

const AthletesPage: React.FC = () => {
    const { athletes } = useData();

    return (
        <div className="bg-[#E0E0E0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="font-heading text-4xl md:text-5xl tracking-tight text-gray-900 mb-6 uppercase">
                        Our Athletes
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-16 max-w-3xl mx-auto">
                        We are proud to partner with athletes who embody the spirit of perseverance, excellence, and relentless drive. They push the limits, and we provide the gear to help them get there.
                    </p>
                </div>
                
                {athletes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {athletes.map(athlete => (
                            <AthleteCard key={athlete.id} athlete={athlete} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p>Our roster of athletes is currently being updated. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AthletesPage;