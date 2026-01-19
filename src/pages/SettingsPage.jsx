import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import UserInfoCard from '../components/infocards/UserInfoCard';
import UserModal from '../components/modals/UserModal';

export default function SettingsPage() {
    const { user, refreshUser } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditSuccess = () => {
        refreshUser();
    };

    return (
        <div className="mt-4 text-left space-y-6 pb-12">
            <div>
                <h1 className="text-xl font-medium text-gray-900">Settings</h1>
                <p className="text-gray-500 text-sm">Manage settings.</p>
            </div>

            <UserInfoCard
                user={user}
                onEdit={() => setIsEditModalOpen(true)}
            />



            <UserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
}
