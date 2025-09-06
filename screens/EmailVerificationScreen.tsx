import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, RefreshCw, X, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

interface EmailVerificationScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EmailVerificationScreen({ onSuccess, onCancel }: EmailVerificationScreenProps) {
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { user, resendVerification, refreshUser, isEmailVerified } = useAuth();

  useEffect(() => {
    if (isEmailVerified) {
      onSuccess();
    }
  }, [isEmailVerified]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    try {
      await resendVerification();
      setResendCooldown(60); // 60 second cooldown
      Alert.alert('Success', 'Verification email sent! Please check your inbox.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setLoading(true);
    try {
      await refreshUser();
      if (isEmailVerified) {
        Alert.alert('Success', 'Email verified successfully!');
        onSuccess();
      } else {
        Alert.alert('Not Verified', 'Email is not yet verified. Please check your inbox and click the verification link.');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to refresh verification status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={64} color="#2563eb" />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification link to{'\n'}
          <Text style={styles.email}>{user?.email}</Text>
        </Text>

        <Text style={styles.description}>
          Please check your email and click the verification link to access premium features.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleRefreshStatus}
            disabled={loading}
          >
            <RefreshCw size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>
              {loading ? 'Checking...' : 'I\'ve Verified'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              (loading || resendCooldown > 0) && styles.disabledButton
            ]}
            onPress={handleResendVerification}
            disabled={loading || resendCooldown > 0}
          >
            <Text style={styles.secondaryButtonText}>
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : 'Resend Email'
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Tips:</Text>
          <Text style={styles.tipText}>• Check your spam/junk folder</Text>
          <Text style={styles.tipText}>• Make sure you clicked the link in the email</Text>
          <Text style={styles.tipText}>• The verification link expires in 24 hours</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontWeight: '600',
    color: '#2563eb',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  tips: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 4,
  },
});
