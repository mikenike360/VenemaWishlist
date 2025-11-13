import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ActivityItem {
  id: string;
  type: 'profile_claimed' | 'profile_updated' | 'approval_requested' | 'approval_approved';
  message: string;
  timestamp: string;
  profile_name?: string;
}

const RecentActivity: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const activitiesList: ActivityItem[] = [];

    // Get recent profile updates
    const { data: recentProfiles } = await supabase
      .from('profiles')
      .select('name, updated_at, claimed_by')
      .eq('claimed_by', user.id)
      .order('updated_at', { ascending: false })
      .limit(5);

    if (recentProfiles) {
      recentProfiles.forEach((profile) => {
        activitiesList.push({
          id: `profile-${profile.name}`,
          type: 'profile_updated',
          message: `Updated ${profile.name}'s profile`,
          timestamp: profile.updated_at,
          profile_name: profile.name,
        });
      });
    }

    // Get recent approvals
    const { data: recentApprovals } = await supabase
      .from('user_approvals')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(3);

    if (recentApprovals) {
      recentApprovals.forEach((approval) => {
        if (approval.status === 'approved') {
          activitiesList.push({
            id: `approval-${approval.id}`,
            type: 'approval_approved',
            message: `Registration approved for ${approval.requested_name}`,
            timestamp: approval.updated_at,
            profile_name: approval.requested_name,
          });
        }
      });
    }

    // Sort by timestamp and limit to 10
    activitiesList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setActivities(activitiesList.slice(0, 10));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchActivity();
    }
  }, [user, fetchActivity]);

  if (loading) {
    return (
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h3 className="card-title">Recent Activity</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-base-300 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body">
        <h3 className="card-title text-lg">Recent Activity</h3>
        <div className="space-y-2">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-2 text-sm">
              <span className="text-base-content/60">
                {activity.type === 'profile_updated' && '✏️'}
                {activity.type === 'approval_approved' && '✅'}
                {activity.type === 'approval_requested' && '📝'}
              </span>
              <div className="flex-1">
                <p className="text-base-content">{activity.message}</p>
                <p className="text-xs text-base-content/60">
                  {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;

