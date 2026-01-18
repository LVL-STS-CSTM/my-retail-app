
import React from 'react';
import { useContentData } from '../context/ContentContext';

const Services: React.FC = () => {
    const { ourServices } = useContentData();

    if (ourServices.length === 0) return null;

    return (
        <section id="services" className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold text-gray-800">What We Do</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">From concept to creation, we are your partners in custom apparel.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ourServices.map((service, index) => (
                        <div key={index} className="flex items-start p-6 bg-gray-50 rounded-lg transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex-shrink-0">
                                <span className="text-4xl text-indigo-600">{service.icon}</span>
                            </div>
                            <div className="ml-5">
                                <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                                <p className="mt-2 text-base text-gray-600">{service.description}</p>
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>
        </section>
    );
};

export default Services;
