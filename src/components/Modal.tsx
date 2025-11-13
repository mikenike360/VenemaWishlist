import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

interface ModalOptions {
  title: string;
  message: string;
  type?: 'alert' | 'confirm' | 'prompt';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  defaultValue?: string; // For prompt type
}

interface ModalContextType {
  showAlert: (title: string, message: string) => Promise<void>;
  showConfirm: (title: string, message: string) => Promise<boolean>;
  showPrompt: (title: string, message: string, defaultValue?: string) => Promise<string | null>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modal, setModal] = useState<ModalOptions | null>(null);
  const [promptValue, setPromptValue] = useState<string>('');
  const promptResolveRef = useRef<((value: string | null) => void) | null>(null);

  const showAlert = useCallback((title: string, message: string): Promise<void> => {
    return new Promise((resolve) => {
      setModal({
        title,
        message,
        type: 'alert',
        confirmText: 'OK',
        onConfirm: () => {
          setModal(null);
          resolve();
        },
      });
    });
  }, []);

  const showConfirm = useCallback((title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModal({
        title,
        message,
        type: 'confirm',
        confirmText: 'Yes',
        cancelText: 'No',
        onConfirm: () => {
          setModal(null);
          resolve(true);
        },
        onCancel: () => {
          setModal(null);
          resolve(false);
        },
      });
    });
  }, []);

  const showPrompt = useCallback((title: string, message: string, defaultValue: string = ''): Promise<string | null> => {
    return new Promise((resolve) => {
      setPromptValue(defaultValue);
      promptResolveRef.current = resolve;
      setModal({
        title,
        message,
        type: 'prompt',
        defaultValue,
        confirmText: 'OK',
        cancelText: 'Cancel',
        onConfirm: () => {
          const value = promptValue || defaultValue;
          setModal(null);
          setPromptValue('');
          if (promptResolveRef.current) {
            promptResolveRef.current(value || null);
            promptResolveRef.current = null;
          }
        },
        onCancel: () => {
          setModal(null);
          setPromptValue('');
          if (promptResolveRef.current) {
            promptResolveRef.current(null);
            promptResolveRef.current = null;
          }
        },
      });
    });
  }, [promptValue]);

  const handleClose = () => {
    if (modal?.onCancel) {
      modal.onCancel();
    } else {
      setModal(null);
      if (promptResolveRef.current) {
        promptResolveRef.current(null);
        promptResolveRef.current = null;
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handlePromptConfirm = () => {
    const value = promptValue || modal?.defaultValue || '';
    setModal(null);
    setPromptValue('');
    if (promptResolveRef.current) {
      promptResolveRef.current(value || null);
      promptResolveRef.current = null;
    }
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      {modal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]"
          onClick={handleBackdropClick}
        >
          <div className="modal modal-open">
            <div className="modal-box bg-base-100 shadow-2xl max-w-md">
              <h3 className="font-bold text-lg mb-4">{modal.title}</h3>
              <p className="py-4 text-base-content/80">{modal.message}</p>
              
              {modal.type === 'prompt' && (
                <div className="form-control mb-4">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handlePromptConfirm();
                      }
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        handleClose();
                      }
                    }}
                    placeholder={modal.defaultValue || 'Enter value...'}
                  />
                </div>
              )}

              <div className="modal-action">
                {modal.type === 'confirm' || modal.type === 'prompt' ? (
                  <>
                    <button className="btn btn-ghost" onClick={handleClose}>
                      {modal.cancelText || 'Cancel'}
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={modal.type === 'prompt' ? handlePromptConfirm : modal.onConfirm}
                    >
                      {modal.confirmText || 'OK'}
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={modal.onConfirm}
                  >
                    {modal.confirmText || 'OK'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
