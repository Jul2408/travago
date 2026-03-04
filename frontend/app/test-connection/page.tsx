'use client';

import { useState } from 'react';
import axiosInstance from '@/lib/axios';

export default function TestConnectionPage() {
    const [status, setStatus] = useState<string>('Not started');
    const [error, setError] = useState<string>('');

    const test = async () => {
        setStatus('Testing...');
        setError('');
        try {
            const res = await axiosInstance.get('users/check-auth/');
            setStatus(`Success! Status: ${res.status}`);
        } catch (err: any) {
            setStatus('Failed');
            setError(err.message + (err.response ? ` (${err.response.status})` : ' (No response)'));
            console.error(err);
        }
    };

    return (
        <div className="p-10 font-sans">
            <h1 className="text-2xl font-bold mb-4">Test Connection</h1>
            <button
                onClick={test}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
            >
                Run Test
            </button>
            <div className="mt-4">
                <p>Status: <strong>{status}</strong></p>
                {error && <p className="text-red-600 mt-2">Error: {error}</p>}
            </div>
            <p className="mt-8 text-sm text-gray-500">
                Backend URL: {axiosInstance.defaults.baseURL}
            </p>
        </div>
    );
}
