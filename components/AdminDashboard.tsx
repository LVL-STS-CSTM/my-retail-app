
import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { SubmittedQuote, QuoteStatus } from '../types';
import QuoteDetailModal from './QuoteDetailModal';
import ProductManagement from './ProductManagement';
import DashboardAnalytics from './DashboardAnalytics';
import FaqManagement from './FaqManagement';
import HeroManagement from './HeroManagement';
import CollectionManagement from './CollectionManagement';
import PartnerManagement from './PartnerManagement';
import HowWeWorkManagement from './HowWeWorkManagement';
import FabricManagement from './FabricManagement';
import SubscriptionManagement from './SubscriptionManagement';
import EmailMarketing from './EmailMarketing';
import InfoCardManagement from './InfoCardManagement';
import FeaturedVideoManagement from './FeaturedVideoManagement';
import BrandReviewManagement from './BrandReviewManagement';
import PlatformRatingManagement from './PlatformRatingManagement';
import AthleteManagement from './AthleteManagement';
import CommunityManagement from './CommunityManagement';

// Available statuses for the dropdown filter.
const STATUSES: QuoteStatus[] = ['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'];

const QuoteManagement: React.FC = () => {
    const { submittedQuotes, updateQuoteStatus, fetchAdminData } = useAdmin();
    const [selectedQuote, setSelectedQuote] = useState<SubmittedQuote | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    
    useEffect(() => {
        // Fetch data if it's not already loaded
        if (submittedQuotes.length === 0) {
            fetchAdminData();
        }
    }, [fetchAdminData, submittedQuotes.length]);

    const sortedQuotes = useMemo(() => {
        if (!submittedQuotes) return [];
        return [...submittedQuotes].sort((a, b) => {
            const dateA = new Date(a.submissionDate).getTime();
            const dateB = new Date(b.submissionDate).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [submittedQuotes, sortOrder]);

    const handleStatusChange = (quoteId: string, status: QuoteStatus) => {
        updateQuoteStatus(quoteId, status);
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                    <label htmlFor="sort-order" className="sr-only">Sort Order</label>
                    <select
                        id="sort-order"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A3A3A] sm:text-sm"
                    >
                        <option value="newest">Sort by Newest</option>
                        <option value="oldest">Sort by Oldest</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedQuotes.map((quote) => (
                                <tr key={quote.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(quote.submissionDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{quote.contact.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.contact.company || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={quote.status}
                                            onChange={(e) => handleStatusChange(quote.id, e.target.value as QuoteStatus)}
                                            className="p-1 border border-gray-300 rounded-md text-xs"
                                        >
                                            {STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => setSelectedQuote(quote)} className="text-indigo-600 hover:text-indigo-900">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {sortedQuotes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No quote requests submitted yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedQuote && (
                <QuoteDetailModal 
                    quote={selectedQuote} 
                    isOpen={!!selectedQuote} 
                    onClose={() => setSelectedQuote(null)} 
                />
            )}
        </>
    )
}


/**
 * @description The main page for the admin area, displaying and managing submitted quote requests.
 */
const AdminDashboard: React.FC = () => {
    const { logout, subscriptions } = useAdmin();
    const [activeTab, setActiveTab] = useState<'analytics' | 'quotes' | 'products' | 'collections' | 'subscriptions' | 'email-marketing' | 'content'>('analytics');
    const [contentSubTab, setContentSubTab] = useState<'banners' | 'info-cards' | 'featured-video' | 'materials' | 'how-we-work' | 'partners' | 'brand-reviews' | 'platform-ratings' | 'faqs' | 'athletes' | 'community'>('banners');

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage quote requests and site content.</p>
                    </div>
                     <button onClick={logout} className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Logout
                    </button>
                </header>

                <div className="flex border-b border-gray-300 mb-6 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'analytics' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('quotes')}
                        className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'quotes' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Quote Management
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'products' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Product Management
                    </button>
                     <button
                        onClick={() => setActiveTab('collections')}
                        className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'collections' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Collections
                    </button>
                     <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'subscriptions' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Subscribers ({subscriptions.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('email-marketing')}
                        className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'email-marketing' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Email Marketing
                    </button>
                     <button
                        onClick={() => setActiveTab('content')}
                        className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'content' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Site Content
                    </button>
                </div>

                {activeTab === 'analytics' && <DashboardAnalytics />}
                {activeTab === 'quotes' && <QuoteManagement />}
                {activeTab === 'products' && <ProductManagement />}
                {activeTab === 'collections' && <CollectionManagement />}
                {activeTab === 'subscriptions' && <SubscriptionManagement />}
                {activeTab === 'email-marketing' && <EmailMarketing />}
                {activeTab === 'content' && (
                     <div className="space-y-6">
                        <div className="bg-[#E0E0E0] p-2 rounded-lg shadow-md flex items-center space-x-2 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setContentSubTab('banners')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'banners' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Hero Banners
                            </button>
                            <button
                                onClick={() => setContentSubTab('info-cards')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'info-cards' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Info Cards
                            </button>
                            <button
                                onClick={() => setContentSubTab('featured-video')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'featured-video' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Featured Video
                            </button>
                            <button
                                onClick={() => setContentSubTab('materials')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'materials' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Materials
                            </button>
                             <button
                                onClick={() => setContentSubTab('how-we-work')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'how-we-work' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                How We Work
                            </button>
                            <button
                                onClick={() => setContentSubTab('partners')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'partners' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Partners
                            </button>
                            <button
                                onClick={() => setContentSubTab('brand-reviews')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'brand-reviews' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Brand Reviews
                            </button>
                            <button
                                onClick={() => setContentSubTab('platform-ratings')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'platform-ratings' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Platform Ratings
                            </button>
                            <button
                                onClick={() => setContentSubTab('faqs')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'faqs' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                FAQ
                            </button>
                             <button
                                onClick={() => setContentSubTab('athletes')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'athletes' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Athletes
                            </button>
                            <button
                                onClick={() => setContentSubTab('community')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${contentSubTab === 'community' ? 'bg-[#3A3A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Community
                            </button>
                        </div>
                        
                        {contentSubTab === 'faqs' && <FaqManagement />}
                        {contentSubTab === 'banners' && <HeroManagement />}
                        {contentSubTab === 'partners' && <PartnerManagement />}
                        {contentSubTab === 'how-we-work' && <HowWeWorkManagement />}
                        {contentSubTab === 'materials' && <FabricManagement />}
                        {contentSubTab === 'info-cards' && <InfoCardManagement />}
                        {contentSubTab === 'featured-video' && <FeaturedVideoManagement />}
                        {contentSubTab === 'brand-reviews' && <BrandReviewManagement />}
                        {contentSubTab === 'platform-ratings' && <PlatformRatingManagement />}
                        {contentSubTab === 'athletes' && <AthleteManagement />}
                        {contentSubTab === 'community' && <CommunityManagement />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
