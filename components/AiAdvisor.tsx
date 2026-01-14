import React, { useState, useRef, useEffect } from 'react';
import { Product, Message } from '../types';
import { ChatIcon, CloseIcon, SendIcon } from './icons';
import { getAdvisorResponse } from '../services/geminiService';

interface AiAdvisorProps {
    allProducts: Product[];
}

const AiAdvisor: React.FC<AiAdvisorProps> = ({ allProducts }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'initial', sender: 'bot', text: "Hello! I'm your AI Product Advisor. How can I help you find the perfect custom apparel today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: trimmedInput };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const botResponseText = await getAdvisorResponse(updatedMessages, allProducts);
            const botMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Failed to send message:", error);
            const errorMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-[#3A3A3A] text-white rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    aria-label="Toggle AI Product Advisor"
                >
                    {isOpen ? <CloseIcon className="w-8 h-8" /> : <ChatIcon className="w-8 h-8" />}
                </button>
            </div>

            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 z-40 w-[90vw] max-w-sm h-[70vh] max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
                    <h3 className="text-lg font-semibold text-gray-800">AI Product Advisor</h3>
                </header>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-[#3A3A3A] text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="text-sm">{message.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-800">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <footer className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about products..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="w-10 h-10 bg-[#3A3A3A] text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:bg-gray-400"
                            disabled={isLoading || !inputValue.trim()}
                            aria-label="Send message"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default AiAdvisor;
