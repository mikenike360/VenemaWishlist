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

  const fetchProfiles = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('name');
    if (data) {
      setProfiles(data);
    }
  }, []);

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
      const { data: pairsData, error } = await supabase
        .from('secret_santa_pairs')
        .select('giver_id, receiver_id, created_at');

      if (error && error.code === '42P01') {
        // Table doesn't exist, create it
        createSecretSantaTable();
        setPairs([]);
      } else if (error) {
        console.error('Error fetching pairs:', error);
        showToast('Error loading Secret Santa pairs: ' + error.message, 'error');
        setPairs([]);
      } else if (pairsData) {
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
        setPairs(enrichedPairs);
        
        // Find user's match
        const userProfiles = profiles.filter(p => p.claimed_by === user.id);
        const userProfileIds = userProfiles.map(p => p.id);
        const match = enrichedPairs.find(p => userProfileIds.includes(p.giver_id));
        setMyMatch(match || null);
      }
    } catch (error: any) {
      console.error('Error fetching pairs:', error);
      showToast('Error loading Secret Santa pairs: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [user, profiles, showToast, createSecretSantaTable]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (user && profiles.length > 0) {
      fetchSecretSantaPairs();
    }
  }, [user, profiles, fetchSecretSantaPairs]);

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

    // Get all claimed profiles
    const claimedProfiles = profiles.filter(p => p.claimed_by);
    
    if (claimedProfiles.length < 2) {
      showAlert('Not Enough Profiles', 'You need at least 2 claimed profiles to generate Secret Santa pairs.');
      return;
    }

    // Shuffle and create pairs
    const shuffled = [...claimedProfiles].sort(() => Math.random() - 0.5);
    const newPairs: SecretSantaPair[] = [];

    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length]; // Circular pairing
      
      // Ensure no one gets themselves
      if (giver.id === receiver.id) {
        const nextIndex = (i + 2) % shuffled.length;
        const altReceiver = shuffled[nextIndex];
        newPairs.push({
          giver_id: giver.id,
          giver_name: giver.name,
          receiver_id: altReceiver.id,
          receiver_name: altReceiver.name,
        });
      } else {
        newPairs.push({
          giver_id: giver.id,
          giver_name: giver.name,
          receiver_id: receiver.id,
          receiver_name: receiver.name,
        });
      }
    }

    // Clear existing pairs and insert new ones
    const deleteResult = await supabase
      .from('secret_santa_pairs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteResult.error) {
      console.error('Error deleting pairs:', deleteResult.error);
      showToast('Error clearing existing pairs: ' + deleteResult.error.message, 'error');
      return;
    }
    
    const { error } = await supabase
      .from('secret_santa_pairs')
      .insert(newPairs.map(p => ({
        giver_id: p.giver_id,
        receiver_id: p.receiver_id,
      })));

    if (error) {
      console.error('Error inserting pairs:', error);
      showToast('Error generating pairs: ' + error.message, 'error');
    } else {
      showToast('Secret Santa pairs generated successfully!', 'success');
      // Refresh profiles first to ensure we have latest data
      await fetchProfiles();
      await fetchSecretSantaPairs();
    }
  };

  const clearPairs = async () => {
    if (!isAdmin) return;

    const confirmed = await showConfirm(
      'Clear All Pairs',
      'Are you sure you want to clear all Secret Santa pairs?'
    );

    if (!confirmed) return;

    const { error } = await supabase.from('secret_santa_pairs').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      showToast('Error clearing pairs: ' + error.message, 'error');
    } else {
      showToast('All pairs cleared', 'success');
      setPairs([]);
      setMyMatch(null);
    }
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-6">🎅 Secret Santa</h1>

            {isAdmin && (
              <div className="flex gap-2 mb-6">
                <button className="btn btn-primary" onClick={generatePairs}>
                  🎲 Generate Pairs
                </button>
                {pairs.length > 0 && (
                  <button className="btn btn-error" onClick={clearPairs}>
                    🗑️ Clear All Pairs
                  </button>
                )}
              </div>
            )}

            {myMatch ? (
              <div className="card bg-primary text-primary-content shadow-lg">
                <div className="card-body text-center">
                  <h2 className="card-title text-2xl justify-center mb-4">🎁 Your Secret Santa Match!</h2>
                  <p className="text-xl mb-2">
                    You are buying a gift for:
                  </p>
                  <p className="text-3xl font-bold mb-4">{myMatch.receiver_name}</p>
                  <p className="text-sm opacity-80">
                    Check their wishlist to see what they want!
                  </p>
                </div>
              </div>
            ) : pairs.length > 0 ? (
              <div className="alert alert-warning">
                <span>No match found for your profiles. Contact admin.</span>
              </div>
            ) : (
              <div className="alert alert-info">
                <span>No Secret Santa pairs have been generated yet. {isAdmin && 'Click "Generate Pairs" to get started!'}</span>
              </div>
            )}

            {isAdmin && pairs.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">All Pairs ({pairs.length})</h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Giver</th>
                        <th>→</th>
                        <th>Receiver</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pairs.map((pair, idx) => (
                        <tr key={idx}>
                          <td className="font-bold">{pair.giver_name}</td>
                          <td>🎁</td>
                          <td>{pair.receiver_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

