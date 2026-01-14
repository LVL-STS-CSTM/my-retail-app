import React from 'react';
import { FaqItem } from '../types';
import Accordion from './Accordion';

/**
 * @interface FaqPageProps
 * @description Props for the FaqPage component.
 * @property {FaqItem[]} faqData - An array of question-answer objects.
 */
interface FaqPageProps {
    faqData: FaqItem[];
}

/**
 * @description The "Frequently Asked Questions" page. It receives FAQ data as a prop
 * and dynamically renders a list of Accordion components for an interactive experience.
 */
const FaqPage: React.FC<FaqPageProps> = ({ faqData }) => {
    return (
        <div className="bg-[#E0E0E0]">
            <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="font-heading text-4xl sm:text-5xl text-gray-900 uppercase">
                        Frequently Asked Questions
                    </h1>
                    <p className="mt-4 text-lg leading-6 text-gray-500">
                        Find quick answers to common questions about our products, services, and processes.
                    </p>
                </div>
                <div className="mt-12">
                    <div className="space-y-1">
                        {/* Map over the faqData array and render an Accordion for each item. */}
                        {faqData.map((item) => (
                            <Accordion key={item.id} title={item.question}>
                                {item.answer}
                            </Accordion>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqPage;