import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { View, CommunityPost } from '../types';
import { InstagramIcon, FacebookIcon } from './icons';

interface CommunityPageProps {
    onNavigate: (page: View, value?: string | null) => void;
}

const SourceIcon: React.FC<{ source: CommunityPost['source'] }> = ({ source }) => {
    switch (source) {
        case 'Instagram':
            return <InstagramIcon />;
        case 'Facebook':
            return <FacebookIcon className="w-6 h-6" />;
        default:
            return null;
    }
};

const PostCard: React.FC<{ post: CommunityPost, onNavigate: CommunityPageProps['onNavigate'] }> = ({ post, onNavigate }) => {
    const { products } = useData();
    
    const taggedProduct = useMemo(() => {
        if (!post.taggedProductId) return null;
        return products.find(p => p.id === post.taggedProductId);
    }, [post.taggedProductId, products]);

    const handleProductClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the main card navigation if any
        if (taggedProduct) {
            onNavigate('product', taggedProduct.id);
        }
    };

    return (
        <div className="group relative break-inside-avoid overflow-hidden rounded-lg shadow-lg mb-6 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <img src={post.imageUrl} alt={post.caption} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-sm italic mb-2">"{post.caption}"</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <SourceIcon source={post.source} />
                        <span>{post.author}</span>
                    </div>
                    {taggedProduct && (
                        <button
                            onClick={handleProductClick}
                            className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
                        >
                            View Product
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
    const { communityPosts } = useData();

    const visiblePosts = useMemo(() => {
        return communityPosts.filter(p => p.isVisible);
    }, [communityPosts]);

    return (
        <div className="bg-[#E0E0E0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="font-heading text-4xl md:text-5xl tracking-tight text-gray-900 mb-6 uppercase">
                        From Our Community
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-16 max-w-3xl mx-auto">
                        See how brands, teams, and creators are bringing their vision to life with LEVEL CUSTOMS.
                    </p>
                </div>

                {visiblePosts.length > 0 ? (
                    <div
                        className="columns-1 sm:columns-2 lg:columns-3 gap-6"
                        style={{ columnFill: 'balance' }}
                    >
                        {visiblePosts.map(post => (
                            <PostCard key={post.id} post={post} onNavigate={onNavigate} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 bg-white/50 rounded-lg">
                        <h3 className="text-xl font-semibold">The Community Gallery is Growing</h3>
                        <p className="mt-2">Check back soon to see amazing creations from our partners!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;