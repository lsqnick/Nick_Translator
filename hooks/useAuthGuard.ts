import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthGuardReturn {
  checkAuth: (requireVerification?: boolean) => boolean;
  showAuthModal: boolean;
  showVerificationModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  setShowVerificationModal: (show: boolean) => void;
}

export function useAuthGuard(): UseAuthGuardReturn {
  const { user, isEmailVerified } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const checkAuth = (requireVerification: boolean = false): boolean => {
    if (!user) {
      setShowAuthModal(true);
      return false;
    }

    if (requireVerification && !isEmailVerified) {
      setShowVerificationModal(true);
      return false;
    }

    return true;
  };

  return {
    checkAuth,
    showAuthModal,
    showVerificationModal,
    setShowAuthModal,
    setShowVerificationModal,
  };
}
