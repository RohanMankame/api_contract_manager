import React from 'react';

export default function UserInfoCard({ user, onEdit }) {
    if (!user) return null;

    const { full_name, role, email, id } = user;

    return (
        <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">User Account</h3>
                    <p className="mt-1 text-sm text-gray-500">Your profile information and account details.</p>
                </div>
                <div className="flex items-center space-x-4">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="group inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 focus:outline-none"
                        >
                            <svg className="-ml-0.5 mr-2 h-4 w-4 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
            <div className="px-6 py-5">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-medium">{full_name || 'N/A'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Role</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-medium capitalize">{role || 'N/A'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-medium">{email || 'N/A'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">User ID</dt>
                        <dd className="mt-1 text-sm text-gray-700 font-mono">{id || 'N/A'}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
