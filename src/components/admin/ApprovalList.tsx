import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';
import { useModal } from '../Modal';
import { UserApproval } from '../../types';

const ApprovalList: React.FC = () => {
  const [approvals, setApprovals] = useState<UserApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { showToast } = useToast();
  const { showPrompt } = useModal();

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('user_approvals').select('*').order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching approvals:', error);
    } else {
      setApprovals(data || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleApproval = async (id: string, status: 'approved' | 'rejected', adminNotes?: string) => {
    const { error } = await supabase
      .from('user_approvals')
      .update({
        status,
        admin_notes: adminNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating approval:', error);
      showToast('Error updating approval: ' + error.message, 'error');
    } else {
      const approval = approvals.find(a => a.id === id);
      // If approved, update the profile to claim it
      if (status === 'approved') {
        if (approval) {
          // Get the profile by name
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('name', approval.requested_name)
            .single();

          if (profile) {
            // Update profile to be claimed by this user
            await supabase
              .from('profiles')
              .update({
                claimed_by: approval.user_id,
                is_approved: true,
              })
              .eq('id', profile.id);
          }
        }
        showToast(`Approved registration for ${approval?.email || 'user'}`, 'success');
      } else {
        showToast(`Rejected registration for ${approval?.email || 'user'}`, 'info');
      }
      fetchApprovals();
    }
  };

  const filteredApprovals = filter === 'all' 
    ? approvals 
    : approvals.filter(a => a.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-warning/50 bg-warning/5';
      case 'approved':
        return 'border-success/50 bg-success/5';
      case 'rejected':
        return 'border-error/50 bg-error/5';
      default:
        return 'border-base-300 bg-base-200';
    }
  };

  return (
    <div className="space-y-2">
      {/* Filter Buttons */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          className={`btn btn-sm gap-2 ${filter === 'all' ? 'btn-active btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('all')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          All ({approvals.length})
        </button>
        <button
          className={`btn btn-sm gap-2 ${filter === 'pending' ? 'btn-active btn-warning' : 'btn-ghost'}`}
          onClick={() => setFilter('pending')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Pending ({approvals.filter(a => a.status === 'pending').length})
        </button>
        <button
          className={`btn btn-sm gap-2 ${filter === 'approved' ? 'btn-active btn-success' : 'btn-ghost'}`}
          onClick={() => setFilter('approved')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Approved ({approvals.filter(a => a.status === 'approved').length})
        </button>
        <button
          className={`btn btn-sm gap-2 ${filter === 'rejected' ? 'btn-active btn-error' : 'btn-ghost'}`}
          onClick={() => setFilter('rejected')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Rejected ({approvals.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      {/* Approval Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredApprovals.length === 0 ? (
          <div className="card bg-base-200 shadow-md col-span-full">
            <div className="card-body text-center py-6">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="text-lg font-bold mb-1">No approvals found</h3>
              <p className="text-sm text-base-content/70">
                {filter !== 'all' ? `No ${filter} approvals at this time` : 'No approval requests available'}
              </p>
            </div>
          </div>
        ) : (
          filteredApprovals.map((approval) => (
            <div 
              key={approval.id} 
              className={`card shadow-md hover:shadow-lg transition-all duration-200 border-2 ${getStatusColor(approval.status)}`}
            >
              <div className="card-body p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-base font-bold truncate">{approval.email}</h3>
                      <span className={`badge badge-sm gap-1 ${
                        approval.status === 'pending' ? 'badge-warning' :
                        approval.status === 'approved' ? 'badge-success' :
                        'badge-error'
                      }`}>
                        {approval.status === 'pending' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        )}
                        {approval.status === 'approved' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {approval.status === 'rejected' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </span>
                    </div>
                    {(approval.requested_name || approval.created_at) && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {approval.requested_name && (
                          <>
                            <span className="text-sm text-base-content/80 font-medium">{approval.requested_name}</span>
                            {approval.created_at && <span className="text-sm text-base-content/60">•</span>}
                          </>
                        )}
                        {approval.created_at && (
                          <span className="text-sm text-base-content/60">
                            {new Date(approval.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    )}
                    {approval.admin_notes && (
                      <div className="mt-3 p-3 bg-base-300/50 rounded-lg border border-base-300">
                        <p className="text-sm text-base-content/70">{approval.admin_notes}</p>
                      </div>
                    )}
                  </div>
                  {approval.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0 flex-col">
                      <button
                        className="btn btn-success btn-sm gap-1"
                        onClick={async () => {
                          const notes = await showPrompt('Admin Notes', 'Admin notes (optional):', '');
                          handleApproval(approval.id, 'approved', notes || undefined);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Approve
                      </button>
                      <button
                        className="btn btn-error btn-sm gap-1"
                        onClick={async () => {
                          const notes = await showPrompt('Rejection Reason', 'Rejection reason (optional):', '');
                          handleApproval(approval.id, 'rejected', notes || undefined);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovalList;

