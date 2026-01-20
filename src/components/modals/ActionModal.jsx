import React from 'react';
import ModalWrapper from '../ModalWrapper';

export default function ActionModal({ isOpen, onClose, title, entityData, onViewDetails, onQuickEdit }) {
    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                {/* Entity Info Box */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {entityData?.name || 'Unknown Entity'}
                    </h3>
                    <p className="text-sm font-mono text-gray-500">
                        ID: {entityData?.id || 'N/A'}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onViewDetails}
                        className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        View Details
                    </button>

                    <button
                        onClick={onQuickEdit}
                        className="w-full rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Quick Edit
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full rounded-md bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}
