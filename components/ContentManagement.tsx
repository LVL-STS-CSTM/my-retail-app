
import React, { useState } from 'react';
import { useContentData } from '../context/ContentContext';

const ContentManagement: React.FC = () => {
    const { 
        hero, setHero, 
        about, setAbout, 
        community, setCommunity,
        // other content pieces can be managed here
    } = useContentData();

    // Local state for form inputs
    const [heroTitle, setHeroTitle] = useState(hero.title);
    const [heroSubtitle, setHeroSubtitle] = useState(hero.subtitle);
    const [aboutTitle, setAboutTitle] = useState(about.title);
    const [aboutSubtitle, setAboutSubtitle] = useState(about.subtitle);
    const [communityTitle, setCommunityTitle] = useState(community.title);
    const [communitySubtitle, setCommunitySubtitle] = useState(community.subtitle);

    const handleHeroSave = () => {
        setHero({ ...hero, title: heroTitle, subtitle: heroSubtitle });
        alert('Hero content updated!');
    };
    
    const handleAboutSave = () => {
        setAbout({ ...about, title: aboutTitle, subtitle: aboutSubtitle });
        alert('About content updated!');
    };
    
    const handleCommunitySave = () => {
        setCommunity({ ...community, title: communityTitle, subtitle: communitySubtitle });
        alert('Community content updated!');
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Hero Content Form */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Hero Section</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Title</label>
                        <input 
                            type="text" 
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Subtitle</label>
                        <textarea
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>
                <div className="text-right mt-4">
                    <button onClick={handleHeroSave} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600">Save Hero</button>
                </div>
            </div>

            {/* About Page Form */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">About Page</h3>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Title</label>
                        <input 
                            type="text" 
                            value={aboutTitle}
                            onChange={(e) => setAboutTitle(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Subtitle</label>
                        <textarea
                            value={aboutSubtitle}
                            onChange={(e) => setAboutSubtitle(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>
                 <div className="text-right mt-4">
                    <button onClick={handleAboutSave} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600">Save About</button>
                </div>
            </div>
            
            {/* Community Section Form */}
             <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Community Section</h3>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Title</label>
                        <input 
                            type="text" 
                            value={communityTitle}
                            onChange={(e) => setCommunityTitle(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Subtitle</label>
                        <textarea
                            value={communitySubtitle}
                            onChange={(e) => setCommunitySubtitle(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>
                 <div className="text-right mt-4">
                    <button onClick={handleCommunitySave} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600">Save Community</p>
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
