import React, { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useData } from '../context/DataContext';
import { SubmittedQuote } from '../types';

const StatCard: React.FC<{title: string, value: string | number, description: string}> = ({title, value, description}) => (
    <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
);


const DashboardAnalytics: React.FC = () => {
    const { submittedQuotes, fetchAdminData } = useAdmin();
    const { products } = useData();

    useEffect(() => {
        // Fetch data if it's not already loaded
        if (submittedQuotes.length === 0) {
            fetchAdminData();
        }
    }, [fetchAdminData, submittedQuotes.length]);

    const totalQuotes = submittedQuotes.length;
    const newQuotes = submittedQuotes.filter(q => q.status === 'New').length;
    const totalProducts = products.length;
    const recentQuotes = [...submittedQuotes].sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()).slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Quote Requests" value={totalQuotes} description="All quotes submitted over time." />
                <StatCard title="New Inquiries" value={newQuotes} description="Quotes with 'New' status needing review." />
                <StatCard title="Total Products" value={totalProducts} description="Products in the catalogue." />
            </div>

            {/* Recent Quotes List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Recent Quote Submissions</h2>
                <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentQuotes.map((quote: SubmittedQuote) => (
                                    <tr key={quote.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(quote.submissionDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{quote.contact.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.contact.company || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                quote.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                quote.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                quote.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentQuotes.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-10 text-gray-500">
                                            No recent quote submissions.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAnalytics;