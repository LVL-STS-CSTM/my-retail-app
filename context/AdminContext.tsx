import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { SubmittedQuote, Subscription, EmailCampaign, QuoteStatus } from '../types';

interface AdminContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    submittedQuotes: SubmittedQuote[];
    subscriptions: Subscription[];
    emailCampaigns: EmailCampaign[];
    fetchAdminData: () => Promise<void>;
    updateQuoteStatus: (quoteId: string, status: QuoteStatus) => Promise<boolean>;
    sendEmailCampaign: (subject: string, content: string, segment: 'all' | 'recent') => Promise<number>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('isAdminAuthenticated') === 'true';
    });
    const [submittedQuotes, setSubmittedQuotes] = useState<SubmittedQuote[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);

    const getAuthToken = () => {
        const user = sessionStorage.getItem('adminUser');
        const pass = sessionStorage.getItem('adminPass');
        return user && pass ? `${user}:${pass}` : null;
    }

    const fetchAdminData = useCallback(async () => {
        if (!isAuthenticated) return;

        const token = getAuthToken();
        if (!token) return;

        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const [quotesRes, subsRes, campaignsRes] = await Promise.all([
                fetch('/api/quotes', { headers }),
                fetch('/api/subscriptions', { headers }),
                fetch('/api/data/emailCampaigns', { headers }),
            ]);

            if (quotesRes.ok) setSubmittedQuotes(await quotesRes.json());
            if (subsRes.ok) setSubscriptions(await subsRes.json());
            if (campaignsRes.ok) setEmailCampaigns(await campaignsRes.json());

        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        }
    }, [isAuthenticated]);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                sessionStorage.setItem('isAdminAuthenticated', 'true');
                sessionStorage.setItem('adminUser', username);
                sessionStorage.setItem('adminPass', password);
                setIsAuthenticated(true);
                // Fetch data immediately on successful login
                await fetchAdminData(); 
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        sessionStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminPass');
        setIsAuthenticated(false);
        setSubmittedQuotes([]);
        setSubscriptions([]);
    };
    
    const updateQuoteStatus = async (quoteId: string, status: QuoteStatus): Promise<boolean> => {
        try {
            const token = getAuthToken();
            if (!token) return false;

            const response = await fetch(`/api/quotes`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quoteId, status }),
            });

            if (response.ok) {
                setSubmittedQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status } : q));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to update quote status:", error);
            return false;
        }
    };

    const sendEmailCampaign = async (subject: string, content: string, segment: 'all' | 'recent'): Promise<number> => {
        // This is a simulation as we don't have a real email sending service
        console.log("Simulating sending email campaign:", { subject, content, segment });
        
        let recipientCount = 0;
        if (segment === 'all') {
            recipientCount = subscriptions.length;
        } else {
             const thirtyDaysAgo = new Date();
             thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
             recipientCount = subscriptions.filter(s => new Date(s.date) > thirtyDaysAgo).length;
        }

        if (recipientCount > 0) {
            const newCampaign: EmailCampaign = {
                id: `camp-${Date.now()}`,
                subject,
                content,
                sentDate: new Date().toISOString(),
                recipientCount,
                recipientSegment: segment,
            };
            const updatedCampaigns = [...emailCampaigns, newCampaign];
            
            const token = getAuthToken();
            if(!token) return 0;
            // Save to KV store
            await fetch('/api/data/emailCampaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedCampaigns)
            });

            setEmailCampaigns(updatedCampaigns);
        }
        
        return recipientCount;
    };
    
    return (
        <AdminContext.Provider value={{ 
            isAuthenticated, 
            login, 
            logout, 
            submittedQuotes, 
            subscriptions, 
            emailCampaigns, 
            fetchAdminData,
            updateQuoteStatus,
            sendEmailCampaign,
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = (): AdminContextType => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};