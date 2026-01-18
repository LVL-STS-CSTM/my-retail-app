
import React from 'react';
import Hero from './Hero';
import FeaturedProducts from './FeaturedProducts';
import CollectionsGrid from './CollectionsGrid';
import Community from './Community';

const HomePage: React.FC = () => {
    return (
        <div>
            <Hero />
            <FeaturedProducts />
            <CollectionsGrid />
            <Community />
        </div>
    );
};

export default HomePage;
