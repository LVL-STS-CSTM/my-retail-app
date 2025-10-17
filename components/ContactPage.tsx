import React, { useState } from 'react';
import { ClockIcon, LocationPinIcon, PhoneIcon } from './icons';
import Button from './Button';
import { SubmittedQuote } from '../types';

interface ContactPageProps {
    showToast: (message: string) => void;
}

/**
 * @description The "Contact Us" / "Location" page. It provides key business information
 * like address, hours, and contact details alongside an interactive map and a quote request form.
 */
const ContactPage: React.FC<ContactPageProps> = ({ showToast }) => {
    const address = 'Block 3 Lot 4, Daang Hari Road, Ayala Alabang, Muntinlupa, 1776 Metro Manila, Philippines';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    // A general embed for Daang Hari Rd in Ayala Alabang, as a specific lot is not pinnable.
    const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15456.45260190539!2d121.01255532599602!3d14.42065097623344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d1e0287a2589%3A0x6758da4f78310153!2sDaang%20Hari%20Rd%2C%20Ayala%20Alabang%2C%20Muntinlupa%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1678886400000!5m2!1sen!2sph`;

    // State for the new quote request form
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const inputClasses = "w-full px-4 py-3 bg-[#3A3A3A] text-white placeholder-gray-400 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submissionData = {
            contact: formData,
            items: [], // No items for a general contact form submission
        };
        
        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.message || 'Could not submit message.'}`);
            }
        } catch (error) {
            showToast('Error: Failed to connect to server.');
            console.error('Contact form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleResetForm = () => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', company: '', message: '', phone: '' });
    }

    return (
        <div className="bg-[#E0E0E0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Information */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="font-heading text-4xl text-gray-900 uppercase">Visit Us</h1>
                            <p className="mt-3 text-lg text-gray-600">
                                We recommend setting an appointment to ensure our team is available to give you their full attention.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Address */}
                            <div className="flex items-start">
                                <LocationPinIcon className="flex-shrink-0 h-7 w-7 text-gray-500 mt-1" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                                    <p className="text-gray-600">
                                        {address}
                                    </p>
                                </div>
                            </div>

                            {/* Operating Hours */}
                            <div className="flex items-start">
                                <ClockIcon className="flex-shrink-0 h-7 w-7 text-gray-500 mt-1" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Operating Hours</h3>
                                    <p className="text-gray-600">Monday - Friday</p>
                                    <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                            
                            {/* Contact */}
                            <div className="flex items-start">
                                <PhoneIcon className="flex-shrink-0 h-7 w-7 text-gray-500 mt-1" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Contact</h3>
                                    <a href="tel:+632888853835" className="text-gray-600 hover:text-black hover:underline">(02) 888-LEVEL (53835)</a>
                                    <a href="mailto:quotes@levelcustomsapparel.com" className="block text-gray-600 hover:text-black hover:underline mt-1">
                                        quotes@levelcustomsapparel.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                href={googleMapsUrl}
                                variant="solid"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Get Directions
                            </Button>
                        </div>
                    </div>
                    
                    {/* Right Column: Map */}
                    <div className="h-96 md:h-full min-h-[450px] w-full rounded-lg overflow-hidden shadow-2xl border-4 border-white">
                        <iframe
                            src={mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="LEVEL CUSTOMS Location"
                        ></iframe>
                    </div>
                </div>

                {/* --- Request a Quote Section --- */}
                <div className="mt-20 pt-16 border-t border-gray-300">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-heading text-3xl text-gray-900 uppercase">Request a Quote</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Have a project in mind? Fill out the form below and our team will get back to you with a personalized quote.
                        </p>
                    </div>

                    <div className="mt-12 max-w-2xl mx-auto">
                        {isSubmitted ? (
                            <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-gray-200">
                                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Request Sent!</h3>
                                <p className="text-gray-700 mb-6">Thank you for your interest. We've received your request and our team will get back to you within 1-2 business days.</p>
                                <button
                                    onClick={handleResetForm}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold text-sm"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl border border-gray-200 space-y-4">
                                <input type="text" name="name" placeholder="Full name" required className={inputClasses} value={formData.name} onChange={handleInputChange} />
                                <input type="email" name="email" placeholder="Email" required className={inputClasses} value={formData.email} onChange={handleInputChange} />
                                <input type="tel" name="phone" placeholder="Phone Number" required className={inputClasses} value={formData.phone} onChange={handleInputChange} />
                                <input type="text" name="company" placeholder="Company" className={inputClasses} value={formData.company} onChange={handleInputChange} />
                                <textarea name="message" placeholder="Your message..." rows={5} required className={inputClasses} value={formData.message} onChange={handleInputChange}></textarea>
                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        className="w-full rounded-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;