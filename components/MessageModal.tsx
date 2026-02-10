
"use client";
import React, { useState } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiverId: string;
    receiverName: string;
}

export default function MessageModal({ isOpen, onClose, receiverId, receiverName }: MessageModalProps) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId,
                    content: message
                })
            });

            if (response.ok) {
                alert('Message sent successfully!');
                setMessage('');
                onClose();
            } else {
                alert('Failed to send message.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-4">Message to {receiverName}</h2>

                <form onSubmit={handleSend}>
                    <textarea
                        className="w-full bg-gray-700 text-white rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={5}
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : <><FaPaperPlane /> Send</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
