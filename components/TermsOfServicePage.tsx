import React from 'react';

const H2: React.FC<{children: React.ReactNode}> = ({ children }) => <h2 className="font-heading text-2xl text-gray-800 mt-8 mb-4 uppercase">{children}</h2>;
const P: React.FC<{children: React.ReactNode}> = ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>;
const UL: React.FC<{children: React.ReactNode}> = ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">{children}</ul>;

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="bg-[#E0E0E0]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="font-heading text-3xl md:text-4xl tracking-tight text-gray-900 mb-6 uppercase">
                    Terms of Service
                </h1>
                <div className="text-base">
                    <P>The following terms and conditions apply to all visitors and users of the LEVEL CUSTOMS website (including all associated domains and subdomains, but not limited to statstechnicalsportwear.com). By using this website you will be bound by all of the subsequent rules and regulations.</P>
                    <P>In the event that a violation of these terms and conditions occurs, LEVEL CUSTOMS reserves the right to seek all remedies available by law and in equity.</P>
                    <P>Unless otherwise stated, the LEVEL CUSTOMS website (hereinafter referred to as the “website”) and all of its contents (including without limitation all text, photographs, images, video, and audio) are exclusive property of LEVEL CUSTOMS APPAREL (hereinafter referred to as “LEVEL CUSTOMS” or “we”) and are protected by copyright, trademark, and other laws.</P>
                    
                    <H2>1. ACCESS AND USE OF THE WEBSITE</H2>
                    <P>1.1 You must only use the website in accordance with these Terms and Conditions and any applicable law.</P>
                    <P>1.2 You must not (or attempt to):</P>
                    <UL>
                        <li>(i) interfere (or attempt to interfere) or disrupt (or attempt to disrupt) the website or the servers or networks that host the website;</li>
                        <li>(ii) use (or attempt to use) data mining, robots, screen scraping, or similar data gathering and extraction tools on the website; or</li>
                        <li>(iii) interfere (or attempt to interfere) with security-related or other features of the website.</li>
                    </UL>
                    <P>1.3 You must not link to our website or any part of our website in a way that damages or takes advantage of our reputation, including but not limited to:</P>
                    <UL>
                        <li>(i) in a way to suggest or imply that you have any kind of association and affiliation with us, or approval and endorsement from us when there is none; or</li>
                        <li>(ii) in a way that is illegal or unfair.</li>
                    </UL>

                    <H2>2. INFORMATION ON THIS WEBSITE</H2>
                    <P>2.1 The website and the content on the website are subject to copyright, trademarks, and other intellectual property rights. These rights are owned by or licensed to LEVEL CUSTOMS.</P>
                    <P>2.2 You must not reproduce, transmit, communicate, adapt, distribute, sell, modify, publish, or otherwise use any of the material on the website, including but not limited to its software or HTML code, scripts, text, artwork, photography, audio, and video excerpts, except as permitted by statute or with LEVEL CUSTOMS' prior written consent.</P>
                    <P>2.3 Due to photographic and screen limitations associated with the representation of products, some products may differ to a small extent in visual appearance (for example, in color) from the way they appear on the website. In addition, where it is suitable to do so, some depictions of products are created or chosen by us for promotional purposes and may not be an exact representation of the products received.</P>
                    
                    <H2>3. ORDERING</H2>
                    <P>3.1 When making an order, you must follow the instructions on the website as to how to make your order and for making changes to your order before you submit it.</P>
                    <P>3.2 Once you select a product that you wish to order, irrespective of any previous price you have seen or heard, you will then be shown or told (on the website) the price you must pay including duties, taxes, and any other charges which are all in the same currency as your purchase.</P>
                    <P>3.3 You must pay for the order in full at the time of ordering by one of the payment methods we provide on the website. You can make your payment through any of these methods:</P>
                    <UL>
                        <li>BDO</li>
                        <li>BPI</li>
                        <li>GCash</li>
                    </UL>
                    <P>3.4 If you discover that you have made a mistake with your order after you have submitted it to the website, please contact us as soon as possible via contact@levelcustomsapparel.com. However, we cannot guarantee that we will be able to amend your order in accordance with your instructions.</P>
                    <P>3.5 When you place an order, you will receive an order confirmation via email from LEVEL CUSTOMS. This email will only be an acknowledgment and will not constitute acceptance of your order. A contract between us for the purchase of the goods will not be formed until you receive a shipment confirmation via email from LEVEL CUSTOMS. We are not obliged to supply the product to you until we have accepted your order, indicated by the shipping confirmation email. We may, at our discretion, refuse to accept an order from you for any reason, including but not limited to:</P>
                    <UL>
                        <li>(i) unavailability of stock or we may offer you an alternative product (in which case we may require you to resubmit your order);</li>
                        <li>(ii) we suspect that you might sell our products to other consumers.</li>
                    </UL>
                    
                    <H2>4. DELIVERY</H2>
                    <P>4.1 We aim to deliver products to you at the place of delivery requested by you within the time indicated by us at the time of your order, but we cannot guarantee any firm delivery dates.</P>
                    <P>4.2 We will try to let you know if we expect to be unable to meet our estimated delivery date, but, to the extent permitted by law, we will not be liable to you for any losses, liabilities, costs, damages, charges, or expenses arising out of late delivery.</P>

                    <H2>5. CANCELLATION</H2>
                    <P>5.1 We may terminate a contract if the product is not available for any reason. We will notify you if this is the case via the contact details that you provided to us when you made your order and return any payment that you have made.</P>
                    <P>5.2 If you wish to cancel your order, please contact our team via contact@levelcustomsapparel.com or the relevant contact page via the website, citing your order number. No cancellation fees will apply before the order has been processed. Once an order has been processed, it cannot be canceled and the item(s) must instead be returned to us in accordance with the Returns Policy.</P>
                    
                    <H2>6. CUSTOMS, IMPORT DUTIES & TAXES</H2>
                    <P>6.1 As your order may be shipped from Parañaque City, Philippines, you may be charged Customs, Import Duties, and Taxes based on your government's policies. These charges will be calculated at checkout based on your delivery address and added to the cost of your order.</P>

                    <H2>7. FAULTY PRODUCT RETURNS</H2>
                    <P>7.1 We aim to provide you with products of the highest standard and quality. If you have received a product with a defect, please contact us via contact@levelcustomsapparel.com or the relevant contact page via the website as soon as possible, so we can guide you through the returns process and help resolve the problem as swiftly as possible.</P>
                    <P>7.2 If the product is confirmed to have a defect, we will replace the product. If the product is found not to have a defect or deemed out of warranty, we will ship the product back to you.</P>
                    <P>7.3 It does not constitute a defect if, in our reasonable opinion, the product has, following the sale to you, become of unacceptable quality due to fair wear and tear, misuse, failure to use it in accordance with the manufacturer’s instructions, using it in an abnormal way, or failure to take reasonable care.</P>

                    <H2>8. CHANGE OF MIND RETURNS</H2>
                    <P>8.1 In addition to your rights in relation to faulty products in clause 7, you can return any product:</P>
                    <UL>
                        <li>(i) within 14 days of receipt and</li>
                        <li>(ii) unworn and unused with the original tags and hygienic seal attached; and</li>
                        <li>(iv) in the original packaging, which must be in the original condition, (not including tissue paper or, which will need to be returned with the product to help protect the product in transit, but does not need to be in its original condition).</li>
                    </UL>
                    <P>Please note our products are all sealed for hygiene reasons and as such can only be returned under change of Mind return policy (clause 8) if the seal is intact. Occasionally, some products may be excluded from the change of Mind return policy.</P>
                    <P>8.2 To ensure the returns are assessed and processed swiftly, you must follow the instructions set out within our Returns Policy.</P>
                    <P>8.3 Upon receiving and inspection of your return, we will contact you regarding next steps via the email supplied to us when you placed your order. Once determined that the return is in compliance with clause 8.1, we will, at your request: (i) refund the price of the product to the payment method used to place your order or (ii) reinstate the price of the product to your store credit or gift card balance in the event these were used as payment methods for placing your order, either in full or partial.</P>
                    <P>8.4 We will not be able to refund any delivery, duties, taxes or fees that you have paid at purchase to have the product shipped to you. If the return, in our reasonable opinion, is not in compliance with clause 8.1, we will contact you to ship the product back to you.</P>
                    <P>8.5 You will be responsible for the cost of returning your goods. LEVEL CUSTOMS holds no responsibility for the cost of the goods being returned, nor in the event the goods are lost or damaged. The customer takes full responsibility for ensuring the goods are returned to LEVEL CUSTOMS in the required state as per clause 8.1.</P>
                    <P>8.6 Nothing in this clause is intended to exclude any rights in clause 6 or any of your statutory rights as a consumer under Philippine Consumer Law.</P>

                    <H2>9. DISCLAIMER AND LIABILITY</H2>
                    <P>9.1 This clause prevails over all other clauses, and, to the extent permitted by law, states our entire liability, and your sole and exclusive remedies, for:</P>
                    <UL>
                        <li>(i) the performance, non-performance, purported performance or delay in performance of these Terms and Conditions or a Contract or the website (or any part of it or them); or</li>
                        <li>(ii) otherwise in relation to these Terms and Conditions or the entering into or performance of these Terms and Conditions.</li>
                    </UL>
                    <P>9.2 Nothing in these Terms and Conditions excludes or limits your statutory rights as a consumer or our Liability for:</P>
                    <UL>
                        <li>(i) fraud;</li>
                        <li>(ii) death or personal injury caused by our breach of duty;</li>
                        <li>(iii) any breach of the obligations implied by law; or</li>
                        <li>(iv) any other liability which cannot be excluded or limited by applicable law.</li>
                    </UL>
                    <P>9.3 In performing any obligation under these Terms and Conditions, our only duty is to exercise reasonable care and skill.</P>

                    <H2>10. INDEMNITY</H2>
                    <P>You indemnify and hold us and our related entities, affiliates, and our and their respective officers, agents, and employees, harmless from and against any and all claims, demands, proceedings, losses and damages (actual, special and consequential) of every kind and nature, known and unknown, including reasonable legal fees, made by any third party due to or arising out of your breach of these Terms and Conditions or your breach of any law or the rights of a third party.</P>
                    
                    <H2>11. MEDIATION AND DISPUTE RESOLUTION</H2>
                    <P>In the event of any dispute under these Terms and Conditions the parties agree to negotiate in good faith to resolve the dispute. Any dispute or difference whatsoever arising out of or in connection with these Terms and Conditions which cannot be resolved by the parties shall be submitted to mediation in accordance with, and subject to, Department of Trade and Industry Philippines.</P>
                    
                    <H2>12. GENERAL</H2>
                    <P>12.1 Entire agreement: These Terms and Conditions contain all the terms agreed between the parties regarding its subject matter and supersedes and excludes any prior agreement, understanding or arrangement between the parties, whether oral or in writing. No representation, undertaking or promise shall be taken to have been given or be implied from anything said or written in negotiations between the parties prior to these Terms and Conditions except as expressly stated in these Terms and Conditions. However, the service and products are provided to you under our operating rules, policies, and procedures as published from time to time on the Website.</P>
                    <P>12.2 Assignment: You may not assign or delegate or otherwise deal with all or any of your rights or obligations under these Terms and Conditions. We shall have the right to assign or otherwise delegate all or any of our rights or obligations under these Terms and Conditions to any person.</P>
                    <P>12.3 Force majeure: We shall not be liable for any breach of our obligations under these Terms and Conditions where we are hindered or prevented from carrying out our obligations by any cause outside our reasonable control, including by lightning, fire, flood, extremely severe weather, strike, lock-out, labour dispute, act of God, war, riot, civil commotion, malicious damage, failure of any telecommunications or computer system, compliance with any law, accident (or by any damage caused by any of such events).</P>
                    <P>12.4 No waiver: No waiver by us of any default of yours under these Terms and Conditions shall operate or be construed as a waiver by us of any future defaults, whether of a like or different character. No granting of time or other forbearance or indulgence by us to you shall in any way release, discharge or otherwise affect your liability under these Terms and Conditions.</P>
                    <P>12.5 Notices: Unless otherwise stated within these Terms and Conditions, notices to be given to either party shall be in writing and shall be delivered by electronic mail at the email address you supplied to us.</P>
                    <P>12.6 Third party rights: All provisions of these Terms and Conditions apply equally to and are for the benefit of LEVEL CUSTOMS, its (or their) affiliates and its (or their) third party content providers and licensors and each shall have the right to assert and enforce such provisions directly or on its own behalf (save that these Terms and Conditions may be varied or rescinded without the consent of those parties).</P>
                    <P>12.7 Survival: The provisions of clauses that either are expressed to survive its expiry or termination or from their nature or context it is contemplated that they are to survive such.</P>
                    <P>12.8 Severability: If any provision of these Terms and Conditions is held to be unlawful, invalid or unenforceable, that provision shall be deemed severed and where capable the validity and enforceability of the remaining provisions of these Terms and Conditions shall not be affected.</P>
                    <P>12.9 Governing law: These Terms and Conditions (and all non-contractual relationships between you and LEVEL CUSTOMS) shall be governed by and construed in accordance with the law of Parañaque City and both parties hereby submit to the jurisdiction of the courts of Parañaque City.</P>
                    <P>12.10 Change of the Terms and Conditions: We reserve the right to amend these Terms and Conditions at any time. All amendments to these Terms and Conditions will be posted online. However, continued use of the website will be deemed to constitute acceptance of the new Terms and Conditions.</P>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;