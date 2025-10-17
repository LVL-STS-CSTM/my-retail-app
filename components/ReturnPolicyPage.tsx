import React from 'react';

const H2: React.FC<{children: React.ReactNode}> = ({ children }) => <h2 className="font-heading text-2xl text-gray-800 mt-8 mb-4 uppercase">{children}</h2>;
const P: React.FC<{children: React.ReactNode}> = ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>;
const UL: React.FC<{children: React.ReactNode}> = ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">{children}</ul>;
const LI: React.FC<{children: React.ReactNode}> = ({ children }) => <li>{children}</li>;

const ReturnPolicyPage: React.FC = () => {
    return (
        <div className="bg-[#E0E0E0]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="font-heading text-3xl md:text-4xl tracking-tight text-gray-900 mb-6 uppercase">
                    Returns & Exchange Policy
                </h1>
                <div className="text-base">
                    <P>At LEVEL CUSTOMS APPAREL, we are committed to providing quality products and excellent customer service. This policy outlines the conditions for returns and exchanges, ensuring a seamless process for our customers.</P>

                    <H2>1. Conditions for Returns and Exchanges</H2>
                    <P>You may request a return or exchange for the following valid reasons:</P>
                    <UL>
                        <LI>The item received has factory defects (e.g., stitching errors, fabric damage).</LI>
                        <LI>The item delivered does not match your order details (e.g., wrong size, color, or design).</LI>
                    </UL>
                    <P><strong>Note:</strong> Change of mind or preference is not covered under the Philippine Consumer Act and, therefore, does not qualify for returns or exchanges.</P>

                    <H2>2. Size Exchange Policy</H2>
                    <P>As part of our commitment to customer satisfaction, we offer size exchanges under the following conditions:</P>
                    <UL>
                        <LI>The item must be unused, unwashed, and in its original packaging, including tags and labels.</LI>
                        <LI>Proof of purchase (e.g., official receipt or order confirmation message) must be presented.</LI>
                        <LI>The desired size must be available in stock.</LI>
                        <LI>Pre-order items are not eligible for size exchanges.</LI>
                        <LI>Customers are responsible for any shipping costs associated with the exchange.</LI>
                    </UL>
                    <P>We advise customers to carefully review the sizing chart and product details before purchasing these items.</P>
                    <P>This service is provided as a courtesy and is not mandated under the Philippine Consumer Act.</P>

                    <H2>3. Timeline for Requests</H2>
                    <P>Returns or exchanges must be initiated within 7 days of receiving the item.</P>
                    <P>Requests beyond this period will not be accommodated unless otherwise required by law.</P>

                    <H2>4. Process for Returns and Exchanges</H2>
                    <P><strong>Initiate a Request:</strong> Contact our Customer Service Team via email at <a href="mailto:contact@levelcustomsapparel.com" className="text-blue-600 hover:underline">contact@levelcustomsapparel.com</a> within the specified timeline and provide the following details:</P>
                    <div className="my-4 p-4 border rounded-md bg-gray-50 text-sm space-y-1">
                        <p><strong>Subject:</strong> RETURN & EXCHANGE</p>
                        <p><strong>Request Type:</strong> [e.g., product inquiry, order update, refund, etc.]</p>
                        <p><strong>Order Form:</strong> [Attach or reference your order form]</p>
                        <p><strong>Proof of Purchase:</strong> [Attach receipt or confirmation]</p>
                        <p><strong>Description of Request:</strong> [Detailed explanation of your request or issue]</p>
                        <p><strong>Photos of the Defective or Incorrect Item:</strong> [Attach relevant photos]</p>
                        <p><strong>Preferred Resolution (if any):</strong> [e.g., replacement, size exchange]</p>
                    </div>
                    <P><strong>Approval:</strong> Wait for confirmation and instruction before sending back the item.</P>
                    <P><strong>Return the Item:</strong> Items can be returned to our store or shipped back to us.</P>
                    <P><strong>Resolution:</strong> Once we inspect and approve the item, we will process the exchange or replacement.</P>
                    
                    <H2>5. Refund Policy</H2>
                    <P>Refunds are only provided in cases where replacement or repair is not possible, as required under the Philippine Consumer Act.</P>
                    <P>Refunds will be processed within 24-48 hours after approval.</P>

                    <H2>6. Non-Returnable Items</H2>
                    <P>For hygiene and safety reasons, certain items are strictly non-refundable, including:</P>
                    <UL>
                        <LI>Undergarments (e.g., women’s sports bras)</LI>
                        <LI>Base layer items (e.g., battlesuit compression bottoms)</LI>
                        <LI>Items sold during warehouse sales or marked as final sale.</LI>
                    </UL>
                    <P>We advise customers to carefully review the sizing chart and product details before purchasing these items.</P>
                    
                    <H2>7. Shipping Costs</H2>
                    <P>If the return or exchange is due to a defect or error on our end, we will shoulder the return shipping fees.</P>
                    <P>For size exchanges, customers are responsible for the shipping costs, both for returning the original item and for the delivery of the new size.</P>

                    <H2>8. Changes to Policy</H2>
                    <P>We reserve the right to modify or update this Return & Exchange Policy at any time. Any changes will be posted on our website, and the updated policy will apply to all purchases made after the date of the update.</P>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicyPage;