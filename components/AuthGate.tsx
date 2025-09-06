import React, { useState } from 'react';
import { Modal } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';

interface AuthGateProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  onAuthRequired?: () => void;
}

export default function AuthGate({ 
  children, 
  requireAuth = false, 
  requireVerification = false,
  onAuthRequired 
}: AuthGateProps) {
  const { user, isEmailVerified } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleAuthRequired = () => {
    if (!user) {
      setShowAuthModal(true);
      onAuthRequired?.();
      return;
    }
    
    if (requireVerification && !isEmailVerified) {
      setShowVerificationModal(true);
      onAuthRequired?.();
      return;
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (requireVerification && !isEmailVerified) {
      setShowVerificationModal(true);
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
  };

  // If auth is required and user is not authenticated, trigger auth flow
  React.useEffect(() => {
    if (requireAuth) {
      handleAuthRequired();
    }
  }, [requireAuth, user, isEmailVerified]);

  return (
    <>
      {children}
      
      <Modal
        visible={showAuthModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AuthScreen 
          onSuccess={handleAuthSuccess}
          onCancel={() => setShowAuthModal(false)}
        />
      </Modal>

      <Modal
        visible={showVerificationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <EmailVerificationScreen 
          onSuccess={handleVerificationSuccess}
          onCancel={() => setShowVerificationModal(false)}
        />
      </Modal>
    </>
  );
}
