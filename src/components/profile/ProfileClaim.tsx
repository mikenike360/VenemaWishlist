import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import LoadingSkeleton from '../LoadingSkeleton';
import { useToast } from '../Toast';
import { useModal } from '../Modal';
import { Profile } from '../../types';
import michaelImage from '../../assets/images/michael.jpg';
import amandaImage from '../../assets/images/amanda.jpg';
import joeyImage from '../../assets/images/joey.jpg';
import aliyaImage from '../../assets/images/aliya.jpg';
import eliImage from '../../assets/images/eli.jpg';
import ellaImage from '../../assets/images/ella.jpg';
import micahImage from '../../assets/images/micah.jpg';
import carrieImage from '../../assets/images/carrie.jpg';
import rockImage from '../../assets/images/rock.jpg';
import kaylaImage from '../../assets/images/kayla.jpg';
import mattImage from '../../assets/images/matt.jpg';
import sonnyImage from '../../assets/images/sonny.jpg';
import barbImage from '../../assets/images/barb.jpg';
import mikeImage from '../../assets/images/mike.jpg';
import ashleyImage from '../../assets/images/ashley.jpg';
import brittanyImage from '../../assets/images/brittany.jpg';
import wendyImage from '../../assets/images/wendy.jpg';
import karlImage from '../../assets/images/karl.jpg';
import marilynImage from '../../assets/images/marilyn.jpg';
import bobImage from '../../assets/images/bob.jpg';
import nickImage from '../../assets/images/nick.jpg';
import nateImage from '../../assets/images/nate.jpg';
import chadImage from '../../assets/images/chad.jpg';
import johnImage from '../../assets/images/john.jpg';
import roenImage from '../../assets/images/roen.jpg';
import nolleImage from '../../assets/images/nolle.jpg';
import toshImage from '../../assets/images/tosh.jpg';
import morganImage from '../../assets/images/morgan.jpg';

// Fallback images mapping
const fallbackImages: Record<string, string> = {
  'Michael': michaelImage,
  'Amanda': amandaImage,
  'Joey': joeyImage,
  'Aliya': aliyaImage,
  'Elijah': eliImage,
  'Ella': ellaImage,
  'Micah': micahImage,
  'Carrie': carrieImage,
  'Rock': rockImage,
  'Kayla': kaylaImage,
  'Matt': mattImage,
  'Sonny': sonnyImage,
  'Barbara': barbImage,
  'Mike': mikeImage,
  'Ashley': ashleyImage,
  'Brittany': brittanyImage,
  'Wendy': wendyImage,
  'Karl': karlImage,
  'Marilyn': marilynImage,
  'Bob': bobImage,
  'Nick': nickImage,
  'Nathaniel': nateImage,
  'Chad': chadImage,
  'John': johnImage,
  'Roen': roenImage,
  'Noli': nolleImage,
  'Tosh': toshImage,
  'Morgan': morganImage,
};

const ProfileClaim: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showConfirm } = useModal();
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [claimedProfiles, setClaimedProfiles] = useState<Profile[]>([]);
  const [unclaiming, setUnclaiming] = useState<string | null>(null);

  const fetchClaimedProfiles = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('claimed_by', user.id)
      .order('name');

    if (data) {
      setClaimedProfiles(data);
    }
  }, [user]);

  const fetchAvailableProfiles = useCallback(async () => {
    setLoading(true);
    // Fetch ALL profiles, not just unclaimed ones
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching profiles:', error);
      setError('Error loading profiles: ' + error.message);
    } else {
      setAvailableProfiles(data || []);
    }
    setLoading(false);
  }, []);

  // Filter out user's claimed profiles from available profiles
  const availableProfilesFiltered = useMemo(() => {
    const claimedIds = new Set(claimedProfiles.map(p => p.id));
    return availableProfiles.filter(p => !claimedIds.has(p.id));
  }, [availableProfiles, claimedProfiles]);

  useEffect(() => {
    if (user) {
      fetchAvailableProfiles();
      fetchClaimedProfiles();
    }
  }, [user, fetchAvailableProfiles, fetchClaimedProfiles]);

  const [approvalStatus, setApprovalStatus] = useState<{
    status: string | null;
    requestedName: string | null;
  }>({ status: null, requestedName: null });

  const checkApprovalStatus = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_approvals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setApprovalStatus({
        status: data.status,
        requestedName: data.requested_name,
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkApprovalStatus();
    }
  }, [user, checkApprovalStatus]);

  const handleClaim = async (profileId: string) => {
    if (!user) return;

    setClaiming(true);
    setError(null);

    // Check if user has an approved request
    const { data: approval, error: approvalError } = await supabase
      .from('user_approvals')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (approvalError || !approval) {
      // Check if there's a pending request
      const { data: pendingApproval } = await supabase
        .from('user_approvals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (pendingApproval) {
        setError(`Your registration is pending approval. You requested to claim "${pendingApproval.requested_name}". Please wait for admin approval.`);
      } else {
        setError('You need admin approval before claiming a profile. Please contact admin.');
      }
      setClaiming(false);
      return;
    }

    // Get the profile to verify it exists and isn't claimed
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (!profile) {
      setError('Profile not found.');
      setClaiming(false);
      return;
    }

    if (profile.claimed_by) {
      setError(`Profile "${profile.name}" is already claimed by someone else.`);
      setClaiming(false);
      return;
    }

    // Try using the database function first (more reliable)
    const { data: functionResult, error: functionError } = await supabase.rpc(
      'claim_profile',
      {
        p_profile_id: profileId,
        p_user_id: user.id,
      }
    );

    if (functionError) {
      // Fallback to direct update if function doesn't exist
      console.log('Function not available, trying direct update:', functionError);
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          claimed_by: user.id,
          is_approved: true,
        })
        .eq('id', profileId)
        .select()
        .single();

      if (error) {
        console.error('Error claiming profile:', error);
        setError('Error claiming profile: ' + error.message + '. You may need to run the allow-multiple-profiles.sql script in Supabase.');
        setClaiming(false);
      } else if (updatedProfile) {
        console.log('Profile claimed successfully:', updatedProfile);
        setError(null);
        // Refresh the lists
        await fetchAvailableProfiles();
        await fetchClaimedProfiles();
        setClaiming(false);
      } else {
        setError('Profile update completed but verification failed. Please refresh and try again.');
        setClaiming(false);
      }
    } else {
      // Function succeeded
      console.log('Profile claimed via function:', functionResult);
      setError(null);
      showToast(`Successfully claimed ${profile.name}!`, 'success');
      // Refresh the lists
      await fetchAvailableProfiles();
      await fetchClaimedProfiles();
      setClaiming(false);
    }
  };

  const handleUnclaim = async (profileId: string) => {
    if (!user) return;

    // Get profile name first for toast message
    const { data: profileData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', profileId)
      .single();

    const confirmed = await showConfirm(
      'Unclaim Profile',
      `Are you sure you want to unclaim ${profileData?.name || 'this profile'}? You can claim it again later if needed.`
    );
    if (!confirmed) {
      return;
    }

    setUnclaiming(profileId);
    setError(null);

    // Try using the database function first
    const { data: functionResult, error: functionError } = await supabase.rpc(
      'unclaim_profile',
      {
        p_profile_id: profileId,
        p_user_id: user.id,
      }
    );

    if (functionError) {
      // Fallback to direct update if function doesn't exist
      console.log('Function not available, trying direct update:', functionError);
      const { error } = await supabase
        .from('profiles')
        .update({
          claimed_by: null,
          is_approved: false,
        })
        .eq('id', profileId)
        .eq('claimed_by', user.id); // Ensure user owns it

      if (error) {
        console.error('Error unclaiming profile:', error);
        setError('Error unclaiming profile: ' + error.message + '. You may need to run the unclaim-profile.sql script in Supabase.');
        showToast('Failed to unclaim profile: ' + error.message, 'error');
        setUnclaiming(null);
      } else {
        showToast(`Successfully unclaimed ${profileData?.name || 'profile'}!`, 'success');
        // Refresh the lists
        await fetchAvailableProfiles();
        await fetchClaimedProfiles();
        setUnclaiming(null);
      }
    } else {
      // Function succeeded
      console.log('Profile unclaimed via function:', functionResult);
      showToast(`Successfully unclaimed ${profileData?.name || 'profile'}!`, 'success');
      // Refresh the lists
      await fetchAvailableProfiles();
      await fetchClaimedProfiles();
      setUnclaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navigation />
        <div className="container mx-auto max-w-6xl py-8 px-4">
          <div className="text-center mb-8">
            <LoadingSkeleton type="text" count={2} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <LoadingSkeleton type="card" count={8} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navigation />
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-primary">
            🎁 Claim Your Profile
          </h1>
          <p className="text-base-content/70 text-lg">
            Select your profile to get started with your wishlist
          </p>
        </div>

        {/* Status Alert */}
        {approvalStatus.status && (
          <div className={`alert shadow-lg mb-6 ${
            approvalStatus.status === 'approved' ? 'alert-success' :
            approvalStatus.status === 'pending' ? 'alert-warning' :
            'alert-error'
          }`}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                {approvalStatus.status === 'approved' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : approvalStatus.status === 'pending' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <div>
                <h3 className="font-bold">
                  {approvalStatus.status === 'approved' ? 'Approved!' : 
                   approvalStatus.status === 'pending' ? 'Pending Approval' : 
                   'Registration Rejected'}
                </h3>
                <div className="text-sm">
                  {approvalStatus.status === 'approved' && approvalStatus.requestedName && (
                    <>You can now claim: <strong>{approvalStatus.requestedName}</strong></>
                  )}
                  {approvalStatus.status === 'pending' && approvalStatus.requestedName && (
                    <>Waiting for admin approval to claim: <strong>{approvalStatus.requestedName}</strong></>
                  )}
                  {approvalStatus.status === 'rejected' && (
                    <>Your registration was rejected. Please contact admin.</>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error shadow-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Claimed Profiles Section */}
        {claimedProfiles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-base-content">Your Claimed Profiles ({claimedProfiles.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
              {claimedProfiles.map((profile) => (
                <div 
                  key={profile.id} 
                  className="card bg-base-100 shadow-xl ring-2 ring-success"
                >
                  <div className="card-body items-center text-center p-6">
                    <div className="avatar mb-4 ring ring-success ring-offset-2">
                      <div className="w-24 rounded-full overflow-hidden">
                        <img 
                          src={profile.image_url || fallbackImages[profile.name] || ''} 
                          alt={profile.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to initial if image fails to load
                            const target = e.target as HTMLImageElement;
                            if (!fallbackImages[profile.name]) {
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.className = 'w-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold';
                                parent.textContent = profile.name.charAt(0);
                              }
                            }
                          }}
                        />
                        {!profile.image_url && !fallbackImages[profile.name] && (
                          <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                            {profile.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <h2 className="card-title text-xl font-bold mb-2">
                      {profile.name}
                    </h2>
                    <div className="badge badge-success gap-2 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Claimed
                    </div>
                    <div className="card-actions w-full gap-2">
                      <button
                        className="btn btn-primary flex-1"
                        onClick={() => navigate(`/profile?profileId=${profile.id}`)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        className="btn btn-error flex-1"
                        onClick={() => handleUnclaim(profile.id)}
                        disabled={unclaiming === profile.id}
                      >
                        {unclaiming === profile.id ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Unclaim
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Profiles Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-base-content">
            {claimedProfiles.length > 0 ? 'Claim More Profiles' : 'Available Profiles'}
          </h2>
          {availableProfilesFiltered.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-2xl font-bold mb-2">No Available Profiles</h2>
                <p className="text-base-content/70">
                  {availableProfiles.length === 0 
                    ? 'No profiles exist in the database. Contact admin to seed profiles.'
                    : 'All profiles have been claimed or you have already claimed all available profiles.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableProfilesFiltered.map((profile) => {
                const isClaimedByUser = profile.claimed_by === user?.id;
                const isClaimedByOther = profile.claimed_by !== null && profile.claimed_by !== user?.id;
                const canClaim = approvalStatus.status === 'approved' && !isClaimedByUser && !isClaimedByOther;
              
              return (
                <div 
                  key={profile.id} 
                  className={`card bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    canClaim
                      ? 'ring-2 ring-success ring-offset-2' 
                      : isClaimedByOther
                      ? 'opacity-60'
                      : ''
                  }`}
                >
                  <div className="card-body items-center text-center p-6">
                    {/* Avatar */}
                    <div className={`avatar mb-4 ${
                      canClaim
                        ? 'ring ring-success ring-offset-2' 
                        : ''
                    }`}>
                      <div className="w-24 rounded-full overflow-hidden">
                        <img 
                          src={profile.image_url || fallbackImages[profile.name] || ''} 
                          alt={profile.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to initial if image fails to load
                            const target = e.target as HTMLImageElement;
                            if (!fallbackImages[profile.name]) {
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.className = 'w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold';
                                parent.textContent = profile.name.charAt(0);
                              }
                            }
                          }}
                        />
                        {!profile.image_url && !fallbackImages[profile.name] && (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                            {profile.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <h2 className="card-title text-xl font-bold mb-2">
                      {profile.name}
                    </h2>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {isClaimedByOther && (
                        <div className="badge badge-neutral gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                          Claimed
                        </div>
                      )}
                      {canClaim && (
                        <div className="badge badge-info gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                          Available
                        </div>
                      )}
                    </div>

                    {/* Claim Button */}
                    <div className="card-actions w-full">
                      <button
                        className={`btn w-full ${
                          canClaim 
                            ? 'btn-success' 
                            : 'btn-disabled'
                        }`}
                        onClick={() => handleClaim(profile.id)}
                        disabled={claiming || !canClaim}
                      >
                        {claiming ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Claiming...
                          </>
                        ) : canClaim ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Claim Profile
                          </>
                        ) : isClaimedByOther ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Already Taken
                          </>
                        ) : (
                          'Not Available'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileClaim;

