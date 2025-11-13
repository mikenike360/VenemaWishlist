import React, { useState } from 'react';
import Navigation from '../Navigation';
import ApprovalList from './ApprovalList';
import ProfileManagement from './ProfileManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'profiles'>('approvals');

  return (
    <div className="min-h-screen bg-base-100">
      <Navigation />
      <div className="container mx-auto px-4 py-2">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-2xl">🔐</div>
              <div>
                <h1 className="card-title text-xl">Admin Dashboard</h1>
                <p className="text-xs text-base-content/70 mt-0.5">Manage user approvals and profiles</p>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="tabs tabs-boxed mb-3 bg-base-200">
              <button
                className={`tab gap-2 transition-all ${
                  activeTab === 'approvals' 
                    ? 'tab-active bg-primary text-primary-content' 
                    : 'hover:bg-base-300'
                }`}
                onClick={() => setActiveTab('approvals')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                User Approvals
              </button>
              <button
                className={`tab gap-2 transition-all ${
                  activeTab === 'profiles' 
                    ? 'tab-active bg-primary text-primary-content' 
                    : 'hover:bg-base-300'
                }`}
                onClick={() => setActiveTab('profiles')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Profile Management
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-2 max-h-[calc(100vh-250px)] overflow-y-auto">
              {activeTab === 'approvals' && <ApprovalList />}
              {activeTab === 'profiles' && <ProfileManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

