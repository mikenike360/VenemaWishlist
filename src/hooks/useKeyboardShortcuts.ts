import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl/Cmd + K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="name" i]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + H: Go home
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        navigate(user ? '/wishlist' : '/');
      }

      // Ctrl/Cmd + P: Go to profile
      if ((e.ctrlKey || e.metaKey) && e.key === 'p' && user) {
        e.preventDefault();
        navigate('/profile');
      }

      // Ctrl/Cmd + A: Go to admin (if admin)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && user) {
        e.preventDefault();
        // Check admin status - this would need to be passed or checked
        navigate('/admin');
      }

      // Escape: Close modals/dropdowns
      if (e.key === 'Escape') {
        // Close any open dropdowns
        document.querySelectorAll('.dropdown').forEach((dropdown) => {
          (dropdown as HTMLElement).blur();
        });
      }

      // ?: Show keyboard shortcuts help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        // Could show a modal with shortcuts
        // For now, just log them
        console.log('Keyboard Shortcuts:\nCtrl+K: Focus search\nCtrl+H: Home\nCtrl+P: Profile\nCtrl+A: Admin\nEsc: Close modals');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, user]);
};

