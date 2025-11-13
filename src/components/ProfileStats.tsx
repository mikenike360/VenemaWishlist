import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfileStatsProps {
  profileId?: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profileId }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    totalProfiles: number;
    totalWishlists: number;
    claimedProfiles: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    
    // Get all profiles claimed by user
    const { data: claimedProfiles } = await supabase
      .from('profiles')
      .select('id, name, wishlist_link')
      .eq('claimed_by', user.id);

    if (claimedProfiles) {
      const profilesWithLinks = claimedProfiles.filter(p => p.wishlist_link && p.wishlist_link !== 'https://www.amazon.com/');
      
      setStats({
        totalProfiles: claimedProfiles.length,
        totalWishlists: profilesWithLinks.length,
        claimedProfiles: claimedProfiles.map(p => p.name),
      });
    }
    
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
        </div>
        <div className="stat-title">Claimed Profiles</div>
        <div className="stat-value text-primary">{stats.totalProfiles}</div>
        <div className="stat-desc">{stats.claimedProfiles.join(', ')}</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div className="stat-title">Wishlists Configured</div>
        <div className="stat-value text-secondary">{stats.totalWishlists}</div>
        <div className="stat-desc">Out of {stats.totalProfiles} profiles</div>
      </div>
    </div>
  );
};

export default ProfileStats;

