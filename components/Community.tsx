
import React from 'react';
import { Link } from 'react-router-dom';
import { useContentData } from '../context/ContentContext';

const Community: React.FC = () => {
    const { community } = useContentData();

    return (
        <section 
            className="bg-cover bg-center py-20 font-sans"
            style={{backgroundImage: `url('${community.backgroundImage}')`}}
        >
            <div className="max-w-4xl mx-auto px-4 text-center bg-gray-800 bg-opacity-70 rounded-lg py-12">
                <h2 className="text-4xl font-heading font-bold text-white">{community.title}</h2>
                <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
                    {community.subtitle}
                </p>
                <Link 
                    to="/community"
                    className="mt-8 inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors"
                >
                    {community.ctaButton.text}
                </Link>
            </div>
        </section>
    );
};

export default Community;
