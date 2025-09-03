import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Crown, Zap, Shield, Clock, Star } from 'lucide-react-native';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  originalPrice?: string;
  popular?: boolean;
  features: PlanFeature[];
  badge?: string;
}

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const plans: SubscriptionPlan[] = [
    {
      id: 'trial',
      name: 'First Purchase',
      duration: '1 Day Trial',
      price: '$0.99',
      badge: '🎯 Try It Out',
      features: [
        { text: 'Real-time translation', included: true },
        { text: 'Basic language support', included: true },
        { text: 'Conversation archive', included: true },
        { text: 'RRT Technology', included: false },
        { text: 'Priority support', included: false },
      ],
    },
    {
      id: '120min',
      name: 'Quick Session',
      duration: '120 Minutes',
      price: '$3.90',
      badge: '⚡ Fast Access',
      features: [
        { text: 'Real-time translation', included: true },
        { text: '15+ language support', included: true },
        { text: 'Conversation archive', included: true },
        { text: 'RRT Technology', included: true },
        { text: 'Priority support', included: false },
      ],
    },
    {
      id: 'weekly',
      name: 'Weekly Pass',
      duration: '7 Days',
      price: '$19.90',
      badge: '🚀 Best Value',
      popular: true,
      features: [
        { text: 'Unlimited translations', included: true },
        { text: '15+ language support', included: true },
        { text: 'Conversation archive', included: true },
        { text: 'RRT Technology', included: true },
        { text: 'Priority support', included: true },
        { text: 'Offline mode', included: true },
      ],
    },
    {
      id: 'monthly',
      name: 'Monthly Pro',
      duration: '1 Month',
      price: '$39.90',
      badge: '👑 Pro Features',
      features: [
        { text: 'Unlimited translations', included: true },
        { text: '15+ language support', included: true },
        { text: 'Conversation archive', included: true },
        { text: 'RRT Technology', included: true },
        { text: 'Priority support', included: true },
        { text: 'Offline mode', included: true },
        { text: 'Advanced context AI', included: true },
        { text: 'Export conversations', included: true },
      ],
    },
    {
      id: 'yearly',
      name: 'Annual Premium',
      duration: '12 Months',
      price: '$239.99',
      originalPrice: '$479.88',
      badge: '💎 50% OFF',
      features: [
        { text: 'Everything in Monthly Pro', included: true },
        { text: 'Advanced voice recognition', included: true },
        { text: 'Custom language models', included: true },
        { text: 'Multi-device sync', included: true },
        { text: 'Premium support', included: true },
        { text: 'Early access to features', included: true },
      ],
    },
  ];

  const handlePurchase = async (planId: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would integrate with RevenueCat
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Purchase Successful! 🎉',
        `You've successfully subscribed to the ${plans.find(p => p.id === planId)?.name} plan.`,
        [{ text: 'Continue', style: 'default' }]
      );
    } catch (error) {
      Alert.alert(
        'Purchase Failed',
        'There was an error processing your purchase. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderFeature = (feature: PlanFeature) => (
    <View key={feature.text} style={styles.featureRow}>
      <View style={[
        styles.featureIcon,
        { backgroundColor: feature.included ? '#dcfce7' : '#f1f5f9' }
      ]}>
        <Check 
          size={12} 
          color={feature.included ? '#16a34a' : '#cbd5e1'} 
        />
      </View>
      <Text style={[
        styles.featureText,
        { color: feature.included ? '#1e293b' : '#94a3b8' }
      ]}>
        {feature.text}
      </Text>
    </View>
  );

  const renderPlan = (plan: SubscriptionPlan) => (
    <View
      key={plan.id}
      style={[
        styles.planCard,
        plan.popular && styles.popularPlan,
        selectedPlan === plan.id && styles.selectedPlan,
      ]}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Star size={12} color="#ffffff" />
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={styles.planBadge}>{plan.badge}</Text>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planDuration}>{plan.duration}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          {plan.originalPrice && (
            <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.featuresContainer}>
        {plan.features.map(renderFeature)}
      </View>
      
      <TouchableOpacity
        style={[
          styles.selectButton,
          selectedPlan === plan.id && styles.selectedButton,
          plan.popular && styles.popularButton,
        ]}
        onPress={() => setSelectedPlan(plan.id)}
        disabled={isLoading}
      >
        <Text style={[
          styles.selectButtonText,
          (selectedPlan === plan.id || plan.popular) && styles.selectedButtonText,
        ]}>
          {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Unlock premium translation features with RRT technology
        </Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Zap size={20} color="#2563eb" />
            </View>
            <Text style={styles.benefitText}>RRT Technology for faster, more accurate translations</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Shield size={20} color="#10b981" />
            </View>
            <Text style={styles.benefitText}>Advanced privacy protection and secure processing</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Clock size={20} color="#f59e0b" />
            </View>
            <Text style={styles.benefitText}>Real-time conversation archiving and management</Text>
          </View>
        </View>
        
        <View style={styles.plansContainer}>
          {plans.map(renderPlan)}
        </View>
        
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={() => handlePurchase(selectedPlan)}
            disabled={isLoading}
          >
            <Text style={styles.purchaseButtonText}>
              {isLoading ? 'Processing...' : 'Start Subscription'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Subscriptions auto-renew. Cancel anytime in Settings. Terms apply.
          </Text>
          
          <View style={styles.linksContainer}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.linkSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.linkSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Restore Purchase</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  benefitsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
    fontWeight: '500',
  },
  plansContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  popularPlan: {
    borderColor: '#2563eb',
  },
  selectedPlan: {
    borderColor: '#10b981',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planBadge: {
    fontSize: 14,
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  planDuration: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2563eb',
  },
  originalPrice: {
    fontSize: 18,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#10b981',
  },
  popularButton: {
    backgroundColor: '#2563eb',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  purchaseButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  disclaimer: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  linkText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  linkSeparator: {
    fontSize: 12,
    color: '#94a3b8',
  },
});