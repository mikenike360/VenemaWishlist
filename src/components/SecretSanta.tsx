import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { useModal } from './Modal';
import { Profile } from '../types';
import Navigation from './Navigation';
import LoadingSkeleton from './LoadingSkeleton';

interface SecretSantaPair {
  giver_id: string;
  giver_name: string;
  receiver_id: string;
  receiver_name: string;
}

const SecretSanta: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const { showConfirm, showAlert } = useModal();
  const [pairs, setPairs] = useState<SecretSantaPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [myMatch, setMyMatch] = useState<SecretSantaPair | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userEmails, setUserEmails] = useState<Map<string, string>>(new Map());

  const fetchProfiles = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('name');
    if (data) {
      setProfiles(data);
    }
  }, []);

  const fetchUserEmails = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      // Get all unique user IDs from all profiles (not just claimed)
      const allUserIds = profiles
        .filter(p => p.claimed_by)
        .map(p => p.claimed_by!)
        .filter((id, index, self) => self.indexOf(id) === index);
      
      if (allUserIds.length === 0) {
        setUserEmails(new Map());
        return;
      }

      // Fetch user emails from user_approvals
      const { data: approvals } = await supabase
        .from('user_approvals')
        .select('user_id, email')
        .in('user_id', allUserIds);

      if (approvals) {
        const emailMap = new Map<string, string>();
        approvals.forEach(approval => {
          emailMap.set(approval.user_id, approval.email);
        });
        setUserEmails(emailMap);
      }
    } catch (error) {
      console.error('Error fetching user emails:', error);
    }
  }, [isAdmin, profiles]);

  const createSecretSantaTable = useCallback(async () => {
    // This would need to be run in Supabase SQL editor
    showToast('Secret Santa table needs to be created. Check console for SQL.', 'warning');
    console.log(`
-- Run this in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS secret_santa_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  giver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(giver_id)
);

CREATE INDEX IF NOT EXISTS idx_secret_santa_giver ON secret_santa_pairs(giver_id);
CREATE INDEX IF NOT EXISTS idx_secret_santa_receiver ON secret_santa_pairs(receiver_id);
    `);
  }, [showToast]);

  const fetchSecretSantaPairs = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Check if secret_santa_pairs table exists, if not create it
      // Use a simple select query without any joins to avoid RLS issues
      // For admins, we want ALL pairs, so we don't add any filters
      // If RLS is still active, this query will be filtered by policies
      const { data: pairsData, error } = await supabase
        .from('secret_santa_pairs')
        .select('giver_id, receiver_id, created_at')
        .limit(1000); // Add limit to avoid any potential issues
      
      // If we're an admin and got fewer pairs than expected, log a warning
      if (isAdmin && pairsData && pairsData.length > 0) {
        const totalOptedIn = profiles.filter(p => p.claimed_by && p.opt_in).length;
        if (pairsData.length < totalOptedIn) {
          console.warn(
            `Admin query returned ${pairsData.length} pairs, but ${totalOptedIn} profiles are opted in. ` +
            `RLS might still be active. Expected ~${totalOptedIn} pairs.`
          );
        }
      }

      if (error && error.code === '42P01') {
        // Table doesn't exist, create it
        createSecretSantaTable();
        setPairs([]);
      } else if (error) {
        console.error('Error fetching pairs:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Is Admin:', isAdmin);
        showToast('Error loading Secret Santa pairs: ' + error.message, 'error');
        setPairs([]);
      } else if (pairsData) {
        console.log('Fetched pairs count:', pairsData.length);
        console.log('Is Admin:', isAdmin);
        
        // Enrich pairs with names from profiles
        const enrichedPairs = pairsData.map(pair => {
          const giver = profiles.find(p => p.id === pair.giver_id);
          const receiver = profiles.find(p => p.id === pair.receiver_id);
          return {
            giver_id: pair.giver_id,
            giver_name: giver?.name || 'Unknown',
            receiver_id: pair.receiver_id,
            receiver_name: receiver?.name || 'Unknown',
          };
        });
        
        console.log('Enriched pairs count:', enrichedPairs.length);
        setPairs(enrichedPairs);
        
        // Find user's match (only for non-admin users, or if admin wants to see their own match)
        const userProfiles = profiles.filter(p => p.claimed_by === user.id);
        const userProfileIds = userProfiles.map(p => p.id);
        const match = enrichedPairs.find(p => userProfileIds.includes(p.giver_id));
        setMyMatch(match || null);
      } else {
        // No data returned
        console.log('No pairs data returned');
        setPairs([]);
      }
    } catch (error: any) {
      console.error('Error fetching pairs:', error);
      showToast('Error loading Secret Santa pairs: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [user, profiles, showToast, createSecretSantaTable, isAdmin]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (user && profiles.length > 0) {
      fetchSecretSantaPairs();
    }
  }, [user, profiles, fetchSecretSantaPairs]);

  useEffect(() => {
    if (isAdmin && profiles.length > 0) {
      fetchUserEmails();
    }
  }, [isAdmin, profiles, fetchUserEmails]);

  const toggleOptIn = async (profileId: string, currentOptIn: boolean) => {
    if (!isAdmin) return;

    // Try using the database function first (bypasses RLS)
    const { error: functionError } = await supabase.rpc('update_profile_opt_in', {
      p_profile_id: profileId,
      p_opt_in: !currentOptIn,
    });

    if (functionError) {
      // Fallback to direct update if function doesn't exist
      const { error } = await supabase
        .from('profiles')
        .update({ opt_in: !currentOptIn })
        .eq('id', profileId);

      if (error) {
        showToast('Error updating opt-in status: ' + error.message, 'error');
        return;
      }
    }

    // Update local state
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === profileId ? { ...p, opt_in: !currentOptIn } : p
      )
    );
  };

  const selectAllOptIn = async () => {
    if (!isAdmin) return;

    const profilesToOptIn = profiles.filter(p => !p.opt_in);
    if (profilesToOptIn.length === 0) return;

    // Update each profile individually using the function to avoid RLS issues
    let hasError = false;
    for (const profile of profilesToOptIn) {
      const { error: functionError } = await supabase.rpc('update_profile_opt_in', {
        p_profile_id: profile.id,
        p_opt_in: true,
      });

      if (functionError) {
        // Fallback to direct update
        const { error } = await supabase
          .from('profiles')
          .update({ opt_in: true })
          .eq('id', profile.id);

        if (error) {
          hasError = true;
          console.error('Error updating profile:', profile.id, error);
        }
      }
    }

    if (hasError) {
      showToast('Some profiles failed to update. Please try again.', 'error');
    } else {
      setProfiles(prevProfiles =>
        prevProfiles.map(p =>
          !p.opt_in ? { ...p, opt_in: true } : p
        )
      );
    }
  };

  const deselectAllOptIn = async () => {
    if (!isAdmin) return;

    const optedInProfiles = profiles.filter(p => p.opt_in);
    if (optedInProfiles.length === 0) return;

    // Update each profile individually using the function to avoid RLS issues
    let hasError = false;
    for (const profile of optedInProfiles) {
      const { error: functionError } = await supabase.rpc('update_profile_opt_in', {
        p_profile_id: profile.id,
        p_opt_in: false,
      });

      if (functionError) {
        // Fallback to direct update
        const { error } = await supabase
          .from('profiles')
          .update({ opt_in: false })
          .eq('id', profile.id);

        if (error) {
          hasError = true;
          console.error('Error updating profile:', profile.id, error);
        }
      }
    }

    if (hasError) {
      showToast('Some profiles failed to update. Please try again.', 'error');
    } else {
      setProfiles(prevProfiles =>
        prevProfiles.map(p =>
          p.opt_in ? { ...p, opt_in: false } : p
        )
      );
    }
  };

  const generatePairs = async () => {
    if (!isAdmin) {
      showToast('Only admins can generate Secret Santa pairs', 'error');
      return;
    }

    const confirmed = await showConfirm(
      'Generate Secret Santa Pairs',
      'This will create new Secret Santa pairs. Existing pairs will be cleared. Continue?'
    );

    if (!confirmed) return;

    // Get all profiles that have opted in (including unclaimed ones)
    const optedInProfiles = profiles.filter(p => p.opt_in);
    
    console.log('Generating pairs for:', optedInProfiles.length, 'opted-in profiles');
    console.log('Total profiles:', profiles.length);
    console.log('Claimed profiles:', profiles.filter(p => p.claimed_by).length);
    console.log('Unclaimed but opted-in:', optedInProfiles.filter(p => !p.claimed_by).length);
    
    if (optedInProfiles.length < 2) {
      showAlert(
        'Not Enough Profiles',
        `You need at least 2 opted-in profiles to generate Secret Santa pairs. Currently ${optedInProfiles.length} profile(s) have opted in.`
      );
      return;
    }

    // Improved pairing algorithm that prevents users from being paired with their own profiles
    // Shuffle profiles multiple times to ensure good randomization
    let shuffled = [...optedInProfiles];
    for (let shuffle = 0; shuffle < 3; shuffle++) {
      shuffled = shuffled.sort(() => Math.random() - 0.5);
    }
    
    const newPairs: SecretSantaPair[] = [];
    const usedReceivers = new Set<string>();

    // Try to pair each giver with a receiver
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      
      // Find available receivers (not the giver itself, preferably not same user, not already used)
      let availableReceivers = shuffled.filter(
        r => r.id !== giver.id && !usedReceivers.has(r.id)
      );
      
      // Prefer receivers that are not from the same user
      const preferredReceivers = availableReceivers.filter(
        r => r.claimed_by !== giver.claimed_by
      );
      
      // Use preferred receivers if available, otherwise use any available
      const receiversToChooseFrom = preferredReceivers.length > 0 
        ? preferredReceivers 
        : availableReceivers;
      
      if (receiversToChooseFrom.length === 0) {
        // This should only happen if we've used all receivers
        // In that case, we need to find the last unused receiver
        const lastReceiver = shuffled.find(r => !usedReceivers.has(r.id) && r.id !== giver.id);
        if (!lastReceiver) {
          showAlert(
            'Pairing Error', 
            'Could not create valid pairs. Make sure you have at least 2 different profiles from different users opted in.'
          );
          return;
        }
        usedReceivers.add(lastReceiver.id);
        newPairs.push({
          giver_id: giver.id,
          giver_name: giver.name,
          receiver_id: lastReceiver.id,
          receiver_name: lastReceiver.name,
        });
      } else {
        // Randomly select from available receivers
        const receiver = receiversToChooseFrom[Math.floor(Math.random() * receiversToChooseFrom.length)];
        usedReceivers.add(receiver.id);
        newPairs.push({
          giver_id: giver.id,
          giver_name: giver.name,
          receiver_id: receiver.id,
          receiver_name: receiver.name,
        });
      }
    }

    // Clear existing pairs using function (bypasses RLS)
    const { error: clearError } = await supabase.rpc('clear_secret_santa_pairs');
    
    if (clearError) {
      // Fallback to direct delete if function doesn't exist
      const deleteResult = await supabase
        .from('secret_santa_pairs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (deleteResult.error) {
        console.error('Error deleting pairs:', deleteResult.error);
        showToast('Error clearing existing pairs: ' + deleteResult.error.message, 'error');
        return;
      }
    }
    
    // Insert new pairs using function (bypasses RLS)
    const giverIds = newPairs.map(p => p.giver_id);
    const receiverIds = newPairs.map(p => p.receiver_id);
    
    const { error: insertError } = await supabase.rpc('insert_secret_santa_pairs', {
      p_giver_ids: giverIds,
      p_receiver_ids: receiverIds,
    });

    if (insertError) {
      // Fallback to direct insert if function doesn't exist
      const { error } = await supabase
        .from('secret_santa_pairs')
        .insert(newPairs.map(p => ({
          giver_id: p.giver_id,
          receiver_id: p.receiver_id,
        })));

      if (error) {
        console.error('Error inserting pairs:', error);
        showToast('Error generating pairs: ' + error.message, 'error');
        return;
      }
    }
    
    showToast('Secret Santa pairs generated successfully!', 'success');
    // Refresh profiles first to ensure we have latest data
    await fetchProfiles();
    await fetchSecretSantaPairs();
  };

  const clearPairs = async () => {
    if (!isAdmin) return;

    const confirmed = await showConfirm(
      'Clear All Pairs',
      'Are you sure you want to clear all Secret Santa pairs?'
    );

    if (!confirmed) return;

    // Try using the function first (bypasses RLS)
    const { error: functionError } = await supabase.rpc('clear_secret_santa_pairs');

    if (functionError) {
      // Fallback to direct delete if function doesn't exist
      const { error } = await supabase
        .from('secret_santa_pairs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        showToast('Error clearing pairs: ' + error.message, 'error');
        return;
      }
    }

    showToast('All pairs cleared', 'success');
    setPairs([]);
    setMyMatch(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton type="list" count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navigation />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 sm:p-6">
            <h1 className="card-title text-2xl sm:text-3xl mb-4 sm:mb-6">🎅 Secret Santa</h1>

            {isAdmin && (
              <>
                {/* Opt-In Management Section */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-bold">Select Participants</h2>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        className="btn btn-sm btn-outline flex-1 sm:flex-none"
                        onClick={selectAllOptIn}
                      >
                        Select All
                      </button>
                      <button
                        className="btn btn-sm btn-outline flex-1 sm:flex-none"
                        onClick={deselectAllOptIn}
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <div className="bg-base-200 p-3 sm:p-4 rounded-lg max-h-64 overflow-y-auto">
                    {profiles.length === 0 ? (
                      <p className="text-sm text-base-content/70">No profiles yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {profiles.map(profile => {
                          const userEmail = profile.claimed_by
                            ? userEmails.get(profile.claimed_by) || 'Unknown'
                            : 'Unclaimed';
                          return (
                            <label
                              key={profile.id}
                              className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-base-300 p-2 rounded"
                            >
                              <input
                                type="checkbox"
                                className="checkbox checkbox-sm"
                                checked={profile.opt_in || false}
                                onChange={() => toggleOptIn(profile.id, profile.opt_in || false)}
                              />
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-sm sm:text-base">{profile.name}</span>
                                <span className="text-xs sm:text-sm text-base-content/70 ml-1 sm:ml-2 block sm:inline">
                                  ({userEmail})
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-base-content/70">
                    {profiles.filter(p => p.opt_in).length} of{' '}
                    {profiles.length} profile(s) opted in
                    {profiles.filter(p => p.claimed_by && p.opt_in).length > 0 && (
                      <span className="ml-1 sm:ml-2">
                        ({profiles.filter(p => p.claimed_by && p.opt_in).length} claimed)
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
                  <button className="btn btn-sm sm:btn-md btn-primary flex-1 sm:flex-none" onClick={generatePairs}>
                    🎲 Generate Pairs
                  </button>
                  {pairs.length > 0 && (
                    <button className="btn btn-sm sm:btn-md btn-error flex-1 sm:flex-none" onClick={clearPairs}>
                      🗑️ Clear All Pairs
                    </button>
                  )}
                </div>
              </>
            )}

            {myMatch ? (
              <div className="card bg-primary text-primary-content shadow-lg">
                <div className="card-body text-center p-4 sm:p-6">
                  <h2 className="card-title text-xl sm:text-2xl justify-center mb-3 sm:mb-4">🎁 Your Secret Santa Match!</h2>
                  <p className="text-lg sm:text-xl mb-2">
                    You are buying a gift for:
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{myMatch.receiver_name}</p>
                  <p className="text-xs sm:text-sm opacity-80">
                    Check their wishlist to see what they want!
                  </p>
                </div>
              </div>
            ) : pairs.length > 0 ? (
              <div className="alert alert-warning text-sm sm:text-base">
                <span>No match found for your profiles. Contact admin.</span>
              </div>
            ) : (
              <div className="alert alert-info text-sm sm:text-base">
                <span>No Secret Santa pairs have been generated yet. {isAdmin && 'Click "Generate Pairs" to get started!'}</span>
              </div>
            )}

            {isAdmin && pairs.length > 0 && (
              <div className="mt-4 sm:mt-6 border-t pt-4 sm:pt-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">All Secret Santa Pairs ({pairs.length})</h2>
                <div className="bg-base-200 rounded-lg p-2 sm:p-4">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra table-xs sm:table-sm w-full">
                      <thead>
                        <tr>
                          <th className="text-xs sm:text-sm font-bold">Giver</th>
                          <th className="text-xs sm:text-sm font-bold text-center w-8 sm:w-12">→</th>
                          <th className="text-xs sm:text-sm font-bold">Receiver</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pairs.map((pair, idx) => (
                          <tr key={idx} className="hover:bg-base-300">
                            <td className="font-semibold py-1 sm:py-2 text-xs sm:text-base">{pair.giver_name}</td>
                            <td className="text-center py-1 sm:py-2 text-base sm:text-lg">🎁</td>
                            <td className="py-1 sm:py-2 text-xs sm:text-base">{pair.receiver_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretSanta;

