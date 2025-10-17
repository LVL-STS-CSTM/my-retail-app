import React from 'react';

// Reusable styling components for consistency
const H2: React.FC<{children: React.ReactNode}> = ({ children }) => <h2 className="font-heading text-2xl text-gray-800 mt-8 mb-4 uppercase">{children}</h2>;
const P: React.FC<{children: React.ReactNode}> = ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>;
const UL: React.FC<{children: React.ReactNode}> = ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">{children}</ul>;
const LI: React.FC<{children: React.ReactNode}> = ({ children }) => <li>{children}</li>;


const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="bg-[#E0E0E0]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="font-heading text-3xl md:text-4xl tracking-tight text-gray-900 mb-6 uppercase">
                    Privacy Policy
                </h1>
                <div className="text-base">
                    <P>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</P>
                    <P>LEVEL CUSTOMS APPAREL ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</P>

                    <H2>1. COLLECTION OF YOUR INFORMATION</H2>
                    <P>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</P>
                    <P><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and company information that you voluntarily give to us when you request a quote or contact us.</P>
                    <P><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</P>
                    
                    <H2>2. USE OF YOUR INFORMATION</H2>
                    <P>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</P>
                    <UL>
                        <LI>Create and manage your quote requests.</LI>
                        <LI>Email you regarding your order or quote.</LI>
                        <LI>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</LI>
                        <LI>Respond to customer service requests.</LI>
                        <LI>Improve the efficiency and operation of the Site.</LI>
                        <LI>Monitor and analyze usage and trends to improve your experience with the Site.</LI>
                    </UL>

                    <H2>3. DISCLOSURE OF YOUR INFORMATION</H2>
                    <P>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</P>
                    <P><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</P>
                    <P><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance. We do not share your information with third parties for their marketing purposes.</P>

                    <H2>4. SECURITY OF YOUR INFORMATION</H2>
                    <P>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</P>

                    <H2>5. YOUR RIGHTS</H2>
                    <P>You have the right to review or change the information we have collected from you. If you wish to do so, please contact us using the contact information provided below. Upon your request, we will update your information.</P>

                    <H2>6. CHANGES TO THIS PRIVACY POLICY</H2>
                    <P>We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.</P>

                    <H2>7. CONTACT US</H2>
                    <P>If you have questions or comments about this Privacy Policy, please contact us at:</P>
                    <P>LEVEL CUSTOMS APPAREL<br />
                    Email: <a href="mailto:contact@levelcustomsapparel.com" className="text-blue-600 hover:underline">contact@levelcustomsapparel.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;