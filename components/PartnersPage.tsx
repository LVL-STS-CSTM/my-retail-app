import React from 'react';
import { Partner, View } from '../types';
import { useData } from '../context/DataContext';
import Button from './Button';

/**
 * @interface PartnersPageProps
 * @description Props for the PartnersPage component.
 * @property {(page: View) => void} onNavigate - Callback function to handle navigation.
 */
interface PartnersPageProps {
    onNavigate: (page: View) => void;
}

/**
 * @description A page to showcase partner logos, building credibility and social proof.
 */
const PartnersPage: React.FC<PartnersPageProps> = ({ onNavigate }) => {
    const { partners } = useData();

    return (
        <div className="bg-[#E0E0E0]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="font-heading text-4xl md:text-5xl tracking-tight text-gray-900 mb-4 uppercase">
                        Trusted by Industry Leaders
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
                        We're proud to collaborate with brands of all sizes, from innovative startups to global icons. Our commitment to quality and service helps them bring their vision to life.
                    </p>
                </div>

                {/* A responsive grid to display partner logos. */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12 items-center">
                    {partners.map((partner) => (
                        <div key={partner.id} className="flex justify-center items-center p-4">
                            <img 
                                src={partner.logoUrl} 
                                alt={`${partner.name} logo`}
                                // Logos are grayscale by default and turn to color on hover for a subtle, professional effect.
                                className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 ease-in-out" 
                            />
                        </div>
                    ))}
                </div>
                
                {/* Call-to-action section at the bottom of the page. */}
                <div className="text-center mt-20">
                     <h2 className="font-heading text-2xl text-gray-800 mb-4 uppercase">Join Our Growing List of Partners</h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Ready to elevate your brand with premium custom apparel? Let's create something exceptional together.
                    </p>
                    <Button
                        variant="light"
                        onClick={() => onNavigate('contact')}
                    >
                        Become a Partner
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default PartnersPage;