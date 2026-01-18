
import React from 'react';

const QuotePage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white p-8 sm:p-12 rounded-2xl shadow-lg">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-800">Get a Custom Quote</h1>
          <p className="mt-4 text-lg text-gray-600">Tell us about your project, and we'll get back to you with a personalized quote.</p>
        </div>

        <form action="#" method="POST" className="space-y-8">
          {/* Contact Information */}
          <div className="space-y-4">
             <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">1. Your Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="full-name" id="full-name" autoComplete="name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" autoComplete="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
              </div>
                 <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company / Organization</label>
                <input type="text" name="company" id="company" autoComplete="organization" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
              </div>
                <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone-number" id="phone-number" autoComplete="tel" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">2. Project Details</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="project-type" className="block text-sm font-medium text-gray-700">Type of Project</label>
                    <select id="project-type" name="project-type" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3">
                        <option>Team Uniforms</option>
                        <option>Brand Merchandise</option>
                        <option>Event Apparel</option>
                        <option>Personal Project</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                     <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Estimated Quantity</label>
                    <input type="number" name="quantity" id="quantity" min="1" placeholder="e.g., 50" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
                </div>
            </div>
            <div>
              <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">Tell us more about your project</label>
              <textarea id="project-description" name="project-description" rows={6} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" placeholder="What products are you interested in? What is your timeline? Do you have a design ready?"></textarea>
            </div>
             <div>
                 <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Upload a design or logo (optional)</label>
                <input id="file-upload" name="file-upload" type="file" className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>
          </div>

          {/* Submission */}
          <div className="text-center pt-6">
            <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center px-12 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuotePage;
