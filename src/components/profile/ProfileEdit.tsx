import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from '../Navigation';
import LoadingSkeleton from '../LoadingSkeleton';
import ProfileStats from '../ProfileStats';
import RecentActivity from '../RecentActivity';
import { useToast } from '../Toast';
import ImageUpload from './ImageUpload';
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

const ProfileEdit: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wishlistLink, setWishlistLink] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchProfiles = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('claimed_by', user.id)
      .order('name');

    if (error) {
      console.error('Error fetching profiles:', error);
      setError('Error loading profiles: ' + error.message);
    } else if (data && data.length > 0) {
      setProfiles(data);
    } else {
      // No profiles found - check if user has an approval
      const { data: approval } = await supabase
        .from('user_approvals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (approval) {
        setError(`You're approved but haven't claimed any profiles yet. Go to /claim to claim profiles.`);
      } else {
        setError('No profiles found. You may need to claim a profile first.');
      }
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    // Check if profileId is in URL params
    const profileIdParam = searchParams.get('profileId');
    if (profileIdParam && profiles.length > 0) {
      const foundProfile = profiles.find(p => p.id === profileIdParam);
      if (foundProfile) {
        // Only update if switching to a different profile
        if (selectedProfileId !== profileIdParam) {
          setSelectedProfileId(profileIdParam);
          setProfile(foundProfile);
          setWishlistLink(foundProfile.wishlist_link || '');
          setImageUrl(foundProfile.image_url);
        } else {
          // Same profile - only update the profile object, don't reset form fields
          setProfile(foundProfile);
        }
      }
    } else if (profiles.length > 0 && !selectedProfileId) {
      // Auto-select first profile if none selected
      setSelectedProfileId(profiles[0].id);
      setProfile(profiles[0]);
      setWishlistLink(profiles[0].wishlist_link || '');
      setImageUrl(profiles[0].image_url);
    }
  }, [profiles, searchParams, selectedProfileId]);

  const handleProfileSelect = (profileId: string) => {
    const selectedProfile = profiles.find(p => p.id === profileId);
    if (selectedProfile) {
      setSelectedProfileId(profileId);
      setProfile(selectedProfile);
      setWishlistLink(selectedProfile.wishlist_link || '');
      setImageUrl(selectedProfile.image_url);
      // Update URL without navigation
      navigate(`/profile?profileId=${profileId}`, { replace: true });
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        wishlist_link: wishlistLink,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (error) {
      setError('Error saving profile: ' + error.message);
      showToast('Failed to save profile: ' + error.message, 'error');
      setSaving(false);
    } else {
      setSuccess(true);
      setSaving(false);
      showToast('Profile updated successfully!', 'success');
      // Refresh profiles to show updated data
      await fetchProfiles();
      setTimeout(() => {
        setSuccess(false);
        // Don't navigate away, let user continue editing
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
            <div className="card-body">
              <LoadingSkeleton type="profile" count={1} />
              <div className="divider"></div>
              <LoadingSkeleton type="text" count={3} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="card-title text-2xl justify-center mb-4">No Profiles Found</h2>
            {error && (
              <div className="alert alert-warning mb-4">
                <span>{error}</span>
              </div>
            )}
            <p className="mb-4">You need to claim a profile first.</p>
            <div className="flex gap-2 justify-center">
              <button className="btn btn-primary" onClick={() => navigate('/claim')}>
                Go to Claim Page
              </button>
              <button className="btn btn-ghost" onClick={fetchProfiles}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will be set by useEffect
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <h1 className="card-title text-3xl">Edit Profile</h1>
            <div className="flex items-center gap-2">
              <button 
                className="btn btn-outline btn-primary"
                onClick={() => navigate('/claim')}
              >
                👤 Claim Profiles
              </button>
              {profiles.length > 1 && (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-outline">
                    {profile.name} ▼
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                    {profiles.map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => handleProfileSelect(p.id)}
                          className={selectedProfileId === p.id ? 'active' : ''}
                        >
                          {p.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Editable Fields Section - Prominent */}
          <div className="space-y-6 mb-8">
            <div className="divider">
              <h2 className="text-xl font-bold">Edit Profile Information</h2>
            </div>

            {/* Profile Picture Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-lg">Profile Picture</span>
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Current Picture Preview */}
                <div className="avatar">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden">
                    <img 
                      src={imageUrl || fallbackImages[profile.name] || ''} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!fallbackImages[profile.name]) {
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.className = 'w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold';
                            parent.textContent = profile.name.charAt(0);
                          }
                        }
                      }}
                    />
                    {!imageUrl && !fallbackImages[profile.name] && (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                {/* Upload Component */}
                <div className="flex-1">
                  <ImageUpload
                    currentImageUrl={imageUrl}
                    onUploadComplete={(url) => {
                      setImageUrl(url);
                      if (profile) {
                        setProfile({ ...profile, image_url: url });
                      }
                      fetchProfiles();
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Wishlist Link */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-lg">Wishlist Link</span>
                <span className="label-text-alt text-base-content/60">Your Amazon wishlist URL</span>
              </label>
              <input
                type="url"
                placeholder="https://www.amazon.com/hz/wishlist/..."
                className="input input-bordered input-lg w-full"
                value={wishlistLink}
                onChange={(e) => setWishlistLink(e.target.value)}
              />
              <label className="label">
                <span className="label-text-alt">Paste your Amazon wishlist link here</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card-actions justify-end mt-6 pt-6 border-t border-base-300">
            <button className="btn btn-ghost" onClick={() => navigate('/wishlist')}>
              Cancel
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Display-Only Information Section */}
          <div className="divider mt-8"></div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Profile Information</h2>
            </div>
            
            {/* Profile Name Display */}
            <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
              <div className="avatar">
                <div className="w-16 rounded-full ring ring-primary ring-offset-2 ring-offset-base-200 overflow-hidden">
                  <img 
                    src={imageUrl || fallbackImages[profile.name] || ''} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!fallbackImages[profile.name]) {
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.className = 'w-16 rounded-full ring ring-primary ring-offset-2 ring-offset-base-200 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold';
                          parent.textContent = profile.name.charAt(0);
                        }
                      }
                    }}
                  />
                  {!imageUrl && !fallbackImages[profile.name] && (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-sm text-base-content/60">Profile Name (cannot be changed)</p>
              </div>
            </div>

            {/* Profile Stats */}
            <div>
              <ProfileStats />
            </div>

            {/* Recent Activity */}
            <div>
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProfileEdit;

