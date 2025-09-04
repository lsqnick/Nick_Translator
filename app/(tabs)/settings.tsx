import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, Mic, Globe, Download, Shield, Bell, Moon, Palette, CircleHelp as HelpCircle, MessageCircle, Star, User, ChevronRight, Info } from 'lucide-react-native';

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  action?: () => void;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    autoDetectLanguage: true,
    enableVibration: true,
    saveConversations: true,
    offlineMode: false,
    nightMode: false,
    notifications: true,
    highQualityAudio: true,
    backgroundListening: false,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Nick Translator',
      'Would you like to rate our app on the App Store?',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Rate Now', style: 'default' },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact our support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', style: 'default' },
        { text: 'Live Chat', style: 'default' },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Translation Settings',
      items: [
        {
          id: 'autoDetect',
          icon: <Globe size={20} color="#2563eb" />,
          title: 'Auto-detect Language',
          subtitle: 'Automatically identify spoken language',
          type: 'toggle' as const,
          value: settings.autoDetectLanguage,
          action: () => toggleSetting('autoDetectLanguage'),
        },
        {
          id: 'saveConversations',
          icon: <Download size={20} color="#10b981" />,
          title: 'Save Conversations',
          subtitle: 'Archive translations for later review',
          type: 'toggle' as const,
          value: settings.saveConversations,
          action: () => toggleSetting('saveConversations'),
        },
        {
          id: 'offlineMode',
          icon: <Download size={20} color="#f59e0b" />,
          title: 'Offline Mode',
          subtitle: 'Download languages for offline use',
          type: 'navigation' as const,
          action: () => {},
        },
      ],
    },
    {
      title: 'Audio & Voice',
      items: [
        {
          id: 'highQualityAudio',
          icon: <Volume2 size={20} color="#8b5cf6" />,
          title: 'High Quality Audio',
          subtitle: 'Better sound quality, uses more data',
          type: 'toggle' as const,
          value: settings.highQualityAudio,
          action: () => toggleSetting('highQualityAudio'),
        },
        {
          id: 'backgroundListening',
          icon: <Mic size={20} color="#ef4444" />,
          title: 'Background Listening',
          subtitle: 'Continue listening when app is minimized',
          type: 'toggle' as const,
          value: settings.backgroundListening,
          action: () => toggleSetting('backgroundListening'),
        },
        {
          id: 'enableVibration',
          icon: <Bell size={20} color="#06b6d4" />,
          title: 'Vibration Feedback',
          subtitle: 'Haptic feedback for interactions',
          type: 'toggle' as const,
          value: settings.enableVibration,
          action: () => toggleSetting('enableVibration'),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'privacy',
          icon: <Shield size={20} color="#10b981" />,
          title: 'Privacy Settings',
          subtitle: 'Manage your data and privacy preferences',
          type: 'navigation' as const,
          action: () => {},
        },
        {
          id: 'dataUsage',
          icon: <Info size={20} color="#64748b" />,
          title: 'Data Usage',
          subtitle: 'View translation and storage statistics',
          type: 'navigation' as const,
          action: () => {},
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          id: 'nightMode',
          icon: <Moon size={20} color="#1e293b" />,
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          type: 'toggle' as const,
          value: settings.nightMode,
          action: () => toggleSetting('nightMode'),
        },
        {
          id: 'theme',
          icon: <Palette size={20} color="#ec4899" />,
          title: 'App Theme',
          subtitle: 'Customize app colors and style',
          type: 'navigation' as const,
          action: () => {},
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          icon: <Bell size={20} color="#f59e0b" />,
          title: 'Push Notifications',
          subtitle: 'Updates, tips, and reminders',
          type: 'toggle' as const,
          value: settings.notifications,
          action: () => toggleSetting('notifications'),
        },
      ],
    },
    {
      title: 'Support & Feedback',
      items: [
        {
          id: 'help',
          icon: <HelpCircle size={20} color="#2563eb" />,
          title: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          type: 'navigation' as const,
          action: () => {},
        },
        {
          id: 'contact',
          icon: <MessageCircle size={20} color="#10b981" />,
          title: 'Contact Support',
          subtitle: 'Get help from our support team',
          type: 'action' as const,
          action: handleContactSupport,
        },
        {
          id: 'rate',
          icon: <Star size={20} color="#f59e0b" />,
          title: 'Rate the App',
          subtitle: 'Share your experience with others',
          type: 'action' as const,
          action: handleRateApp,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'account',
          icon: <User size={20} color="#64748b" />,
          title: 'Account Settings',
          subtitle: 'Manage subscription and profile',
          type: 'navigation' as const,
          action: () => {},
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.action}
      activeOpacity={0.7}
    >
      <View style={styles.settingIcon}>
        {item.icon}
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      
      <View style={styles.settingAction}>
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.action}
            trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
            thumbColor={item.value ? '#ffffff' : '#ffffff'}
          />
        )}
        
        {(item.type === 'navigation' || item.type === 'action') && (
          <ChevronRight size={20} color="#94a3b8" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your translation experience</Text>
      </View>
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Nick Translator v2.1.0</Text>
          <Text style={styles.buildText}>Build 2024.1.15</Text>
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
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  settingAction: {
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  buildText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});