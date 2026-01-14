import React, { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

const SubscriptionManagement: React.FC = () => {
    const { subscriptions, fetchAdminData } = useAdmin();

    useEffect(() => {
        // Fetch data if it's not already loaded
        if (subscriptions.length === 0) {
            fetchAdminData();
        }
    }, [fetchAdminData, subscriptions.length]);


    return (
        <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Email Subscribers ({subscriptions.length})</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[...subscriptions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((sub, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sub.date).toLocaleString()}</td>
                            </tr>
                        ))}
                        {subscriptions.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center py-10 text-gray-500">
                                    No subscribers yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriptionManagement;