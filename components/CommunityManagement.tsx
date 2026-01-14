import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { CommunityPost } from '../types';
import CommunityPostFormModal from './CommunityPostFormModal';

const CommunityManagement: React.FC = () => {
    const { communityPosts, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState<CommunityPost | null>(null);

    const handleAddNew = () => {
        setPostToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (post: CommunityPost) => {
        setPostToEdit(post);
        setIsModalOpen(true);
    };

    const handleDelete = (postId: string) => {
        if (window.confirm('Are you sure you want to delete this community post?')) {
            const newPosts = communityPosts.filter(p => p.id !== postId);
            updateData('communityPosts', newPosts);
        }
    };

    const toggleVisibility = (post: CommunityPost) => {
        const updatedPost = { ...post, isVisible: !post.isVisible };
        const newPosts = communityPosts.map(p => p.id === post.id ? updatedPost : p);
        updateData('communityPosts', newPosts);
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Community Posts ({communityPosts.length})</h2>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                    >
                        Add New Post
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Visible</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {communityPosts.map((post) => (
                                <tr key={post.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-md object-cover" src={post.imageUrl} alt={post.caption} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 truncate w-64">{post.caption}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.source}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button onClick={() => toggleVisibility(post)} className={`px-2 py-1 text-xs font-semibold rounded-full ${post.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {post.isVisible ? 'Yes' : 'No'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleEdit(post)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                             {communityPosts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No community posts found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <CommunityPostFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    postToEdit={postToEdit}
                />
            )}
        </>
    );
};

export default CommunityManagement;