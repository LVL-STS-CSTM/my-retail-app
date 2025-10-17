import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import Accordion from './Accordion';
import { BoldIcon, CloseIcon, EyeIcon, ItalicIcon, LinkIcon, ListIcon, SendIcon, UnderlineIcon } from './icons';

// A sub-component for the rich text editor's toolbar.
const EditorToolbar: React.FC<{ onFormat: (command: string, value?: string) => void }> = ({ onFormat }) => {
    const handleLink = () => {
        const url = prompt('Enter the URL:');
        if (url) {
            onFormat('createLink', url);
        }
    };
    return (
        <div className="flex items-center gap-1 p-2 border border-b-0 rounded-t-md bg-gray-50">
            <button type="button" onClick={() => onFormat('bold')} className="p-2 hover:bg-gray-200 rounded"><BoldIcon className="w-5 h-5"/></button>
            <button type="button" onClick={() => onFormat('italic')} className="p-2 hover:bg-gray-200 rounded"><ItalicIcon className="w-5 h-5"/></button>
            <button type="button" onClick={() => onFormat('underline')} className="p-2 hover:bg-gray-200 rounded"><UnderlineIcon className="w-5 h-5"/></button>
            <button type="button" onClick={() => onFormat('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded"><ListIcon className="w-5 h-5"/></button>
            <button type="button" onClick={handleLink} className="p-2 hover:bg-gray-200 rounded"><LinkIcon className="w-5 h-5"/></button>
        </div>
    );
};


const EmailMarketing: React.FC = () => {
    const { subscriptions, emailCampaigns, sendEmailCampaign, fetchAdminData } = useAdmin();
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState(''); // Stores HTML content
    const [segment, setSegment] = useState<'all' | 'recent'>('all');
    const [isSending, setIsSending] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        // Fetch data if it's not already loaded
        if (subscriptions.length === 0 || emailCampaigns.length === 0) {
            fetchAdminData();
        }
    }, [fetchAdminData, subscriptions.length, emailCampaigns.length]);

    // Calculate recipient count for the selected segment
    const recipientCount = useMemo(() => {
        if (segment === 'recent') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return subscriptions.filter(s => new Date(s.date) > thirtyDaysAgo).length;
        }
        return subscriptions.length;
    }, [segment, subscriptions]);

    const handleFormat = (command: string, value?: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand(command, false, value);
        }
    };

    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        setContent(e.currentTarget.innerHTML);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !content.trim()) {
            alert('Subject and content cannot be empty.');
            return;
        }
        if (recipientCount === 0) {
            alert(`There are no subscribers in the selected segment.`);
            return;
        }

        if (window.confirm(`Are you sure you want to send this campaign to ${recipientCount} subscriber(s)?`)) {
            setIsSending(true);
            const sentCount = await sendEmailCampaign(subject, content, segment);
            if (sentCount > 0) {
                setSubject('');
                setContent('');
                if (editorRef.current) editorRef.current.innerHTML = '';
                alert(`Campaign "${subject}" sent to ${sentCount} subscriber(s)!`);
            } else {
                alert('Sending failed. No subscribers found in the target segment.');
            }
            setIsSending(false);
        }
    };
    
    const sendTestEmail = () => {
        if (!subject.trim() || !content.trim()) {
            alert('Please add a subject and content before sending a test.');
            return;
        }
        alert('Test email sent (simulation). In a real application, this would send an email to the admin.');
    }

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A3A3A] sm:text-sm placeholder-gray-500";

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Composer */}
            <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md lg:sticky lg:top-28">
                <h2 className="text-xl font-semibold mb-4">Compose Campaign</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid sm:grid-cols-[1fr,auto] gap-4">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className={darkInputStyles}
                                placeholder="Announcing our new collection!"
                            />
                        </div>
                         <div>
                            <label htmlFor="segment" className="block text-sm font-medium text-gray-700">Send To</label>
                            <select
                                id="segment"
                                value={segment}
                                onChange={(e) => setSegment(e.target.value as 'all' | 'recent')}
                                className={darkInputStyles}
                            >
                                <option value="all">All Subscribers</option>
                                <option value="recent">Subscribed in Last 30 Days</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <EditorToolbar onFormat={handleFormat} />
                        <div
                            ref={editorRef}
                            contentEditable
                            onInput={handleContentChange}
                            className="mt-0 block w-full h-64 p-3 border rounded-b-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black overflow-y-auto bg-white"
                        />
                    </div>
                    <div className="flex flex-wrap justify-end items-center gap-3 pt-4 border-t">
                        <button type="button" onClick={() => setIsPreviewOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                           <EyeIcon className="w-5 h-5"/> Preview
                        </button>
                         <button type="button" onClick={sendTestEmail} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                           <SendIcon className="w-5 h-5"/> Send Test
                        </button>
                        <button
                            type="submit"
                            disabled={isSending || recipientCount === 0}
                            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                        >
                            {isSending ? 'Sending...' : `Send to ${recipientCount} Subscribers`}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Column: Campaign History */}
            <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Campaign History</h2>
                <div className="space-y-2">
                    {emailCampaigns.length > 0 ? (
                        [...emailCampaigns].sort((a,b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()).map(campaign => (
                            <Accordion 
                                key={campaign.id} 
                                title={`"${campaign.subject}" - ${new Date(campaign.sentDate).toLocaleDateString()}`}
                            >
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between p-2 bg-gray-50 rounded-md">
                                        <span><strong>Recipients:</strong> {campaign.recipientCount}</span>
                                        <span><strong>Segment:</strong> {campaign.recipientSegment}</span>
                                    </div>
                                    <p className="font-semibold">Content Preview:</p>
                                    <div 
                                        className="p-3 bg-gray-100 border rounded prose-sm max-w-none"
                                        // This is safe in this context as the HTML is created by the admin user
                                        dangerouslySetInnerHTML={{ __html: campaign.content }}
                                    />
                                </div>
                            </Accordion>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No campaigns have been sent yet.</p>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {isPreviewOpen && (
                 <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <header className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold">Email Preview</h2>
                            <button onClick={() => setIsPreviewOpen(false)}><CloseIcon className="w-6 h-6"/></button>
                        </header>
                         <div className="p-6 overflow-y-auto">
                            <div className="mb-4">
                                <span className="font-semibold">Subject:</span> {subject || '(No subject)'}
                            </div>
                            <div 
                                className="p-4 border rounded prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500">(No content)</p>' }}
                            />
                         </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default EmailMarketing;