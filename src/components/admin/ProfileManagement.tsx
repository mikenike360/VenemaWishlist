import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';
import { useModal } from '../Modal';
import { Profile } from '../../types';
import LoadingSkeleton from '../LoadingSkeleton';

interface UserProfile {
  id: string;
  email: string;
  profiles: Profile[];
}

const ProfileManagement: React.FC = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();
  const { showConfirm, showPrompt } = useModal();

  const fetchUserProfiles = useCallback(async () => {
    setLoading(true);
    try {
      // Get all profiles with their claimed_by user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('name');

      if (profilesError) throw profilesError;

      // Get all users who have claimed profiles
      const claimedUserIds = profiles?.filter(p => p.claimed_by).map(p => p.claimed_by) || [];
      const userIds = Array.from(new Set(claimedUserIds));

      // Get user emails from auth.users (we'll need to use admin API or create a view)
      // For now, we'll get emails from user_approvals table
      const { data: approvals } = await supabase
        .from('user_approvals')
        .select('user_id, email')
        .in('user_id', userIds);

      // Group profiles by user
      const userMap = new Map<string, UserProfile>();
      
      profiles?.forEach(profile => {
        if (profile.claimed_by) {
          const approval = approvals?.find(a => a.user_id === profile.claimed_by);
          const email = approval?.email || 'Unknown';
          
          if (!userMap.has(profile.claimed_by)) {
            userMap.set(profile.claimed_by, {
              id: profile.claimed_by,
              email,
              profiles: [],
            });
          }
          userMap.get(profile.claimed_by)!.profiles.push(profile);
        }
      });

      // Also add unclaimed profiles
      const unclaimedProfiles = profiles?.filter(p => !p.claimed_by) || [];
      if (unclaimedProfiles.length > 0) {
        userMap.set('unclaimed', {
          id: 'unclaimed',
          email: 'Unclaimed Profiles',
          profiles: unclaimedProfiles,
        });
      }

      setUserProfiles(Array.from(userMap.values()));
    } catch (error: any) {
      console.error('Error fetching user profiles:', error);
      showToast('Error loading profiles: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUserProfiles();
  }, [fetchUserProfiles]);

  const handleUnlinkProfile = async (profileId: string, profileName: string) => {
    const confirmed = await showConfirm(
      'Unlink Profile',
      `Are you sure you want to unlink "${profileName}" from its current user?`
    );
    
    if (!confirmed) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        claimed_by: null,
        is_approved: false,
      })
      .eq('id', profileId);

    if (error) {
      showToast('Error unlinking profile: ' + error.message, 'error');
    } else {
      showToast(`Successfully unlinked "${profileName}"`, 'success');
      fetchUserProfiles();
    }
  };

  const handleLinkProfile = async (profileId: string, profileName: string) => {
    const userEmail = await showPrompt(
      'Link Profile',
      `Enter the email address of the user to link "${profileName}" to:`,
      ''
    );

    if (!userEmail) return;

    // Find user by email from user_approvals
    const { data: approval } = await supabase
      .from('user_approvals')
      .select('user_id')
      .eq('email', userEmail.toLowerCase())
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!approval) {
      showToast('No approved user found with that email', 'error');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        claimed_by: approval.user_id,
        is_approved: true,
      })
      .eq('id', profileId);

    if (error) {
      showToast('Error linking profile: ' + error.message, 'error');
    } else {
      showToast(`Successfully linked "${profileName}" to ${userEmail}`, 'success');
      fetchUserProfiles();
    }
  };

  const filteredUserProfiles = userProfiles.filter(up => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      up.email.toLowerCase().includes(query) ||
      up.profiles.some(p => p.name.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton type="list" count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 mb-2">
        <div>
          <h2 className="text-base font-bold mb-0.5 flex items-center gap-1.5">
            <span className="text-lg">👥</span>
            Profile Management
          </h2>
          <p className="text-base-content/70 text-[10px]">
            Manage profile assignments and user connections
          </p>
        </div>
        <button 
          className="btn btn-primary btn-sm gap-1" 
          onClick={fetchUserProfiles}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="form-control">
        <label className="label py-0.5">
          <span className="label-text text-[10px] font-semibold">🔍 Search Profiles</span>
        </label>
        <input
          type="text"
          placeholder="Search by email or profile name..."
          className="input input-bordered input-primary input-xs w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* User Profiles List */}
      <div className="space-y-4">
        {filteredUserProfiles.length === 0 ? (
          <div className="card bg-base-200 shadow-md">
            <div className="card-body text-center py-6">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="text-lg font-bold mb-1">No profiles found</h3>
              <p className="text-sm text-base-content/70">
                {searchQuery ? 'Try adjusting your search terms' : 'No profiles available'}
              </p>
            </div>
          </div>
        ) : (
          filteredUserProfiles.map((userProfile) => (
            <div key={userProfile.id} className="card bg-gradient-to-br from-base-200 to-base-300 shadow-lg border-2 border-base-300">
              <div className="card-body p-4">
                {/* User Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b-2 border-base-300">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span className="text-lg font-bold">
                          {userProfile.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold flex items-center gap-2">
                        {userProfile.email}
                        {userProfile.id === 'unclaimed' && (
                          <span className="badge badge-warning badge-sm gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Unclaimed
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-base-content/70 mt-1 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {userProfile.profiles.length} {userProfile.profiles.length === 1 ? 'profile' : 'profiles'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profiles Grid */}
                <div 
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))'
                  }}
                >
                  {userProfile.profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border-2 border-base-300 hover:border-primary/50"
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base mb-2 truncate">{profile.name}</h4>
                            {profile.wishlist_link && (
                              <a
                                href={profile.wishlist_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline btn-primary gap-1 mt-2 w-full"
                                title="View Wishlist"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                                Link
                              </a>
                            )}
                            {!profile.wishlist_link && (
                              <div className="badge badge-ghost badge-sm mt-2">No link</div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            {userProfile.id !== 'unclaimed' && (
                              <button
                                className="btn btn-sm btn-error btn-circle"
                                onClick={() => handleUnlinkProfile(profile.id, profile.name)}
                                title="Unlink profile"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                            {userProfile.id === 'unclaimed' && (
                              <button
                                className="btn btn-sm btn-success btn-circle"
                                onClick={() => handleLinkProfile(profile.id, profile.name)}
                                title="Link profile to user"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileManagement;

