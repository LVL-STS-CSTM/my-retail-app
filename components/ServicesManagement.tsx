
import React, { useState } from 'react';
import { OurService } from '../types';
import ServiceFormModal from './ServiceFormModal';
import { useContentData } from '../context/ContentContext';

const ServicesManagement: React.FC = () => {
    const { ourServices, updateContent } = useContentData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<OurService | null>(null);

    const openModal = (service: OurService | null = null) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const handleSave = (service: OurService) => {
        // Logic is now in the modal to update the context
        closeModal();
    };

    const handleDelete = async (serviceId: string) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            const newServices = ourServices.filter(s => s.id !== serviceId);
            const success = await updateContent('ourServices', newServices);
            if (!success) {
                alert('Failed to delete service. Please try again.');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Our Services</h3>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">+ Add Service</button>
            </div>
            <div className="space-y-4">
                {ourServices.map(service => (
                    <div key={service.id} className="p-4 border rounded-md flex justify-between items-start">
                        <div className="flex items-center gap-4">
                             <div className="text-2xl w-8 text-center">{service.icon}</div>
                            <div>
                                <h4 className="font-semibold">{service.title}</h4>
                                <p className="text-sm text-gray-600">{service.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <button onClick={() => openModal(service)} className="text-sm text-indigo-600 hover:text-indigo-800">Edit</button>
                            <button onClick={() => handleDelete(service.id)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                        </div>
                    </div>
                ))}
                {ourServices.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No services listed. Add one to get started!
                    </div>
                )}
            </div>
            {isModalOpen && (
                <ServiceFormModal 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    onSave={handleSave} 
                    service={selectedService} 
                />
            )}
        </div>
    );
};

export default ServicesManagement;
