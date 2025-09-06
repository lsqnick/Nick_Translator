import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Calendar, Volume2, Share, Trash2, Filter } from 'lucide-react-native';

interface ArchivedTranslation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: Date;
  category?: 'meeting' | 'travel' | 'casual' | 'business';
}

export default function ArchiveScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const mockTranslations: ArchivedTranslation[] = [
    {
      id: '1',
      originalText: "Hello, how are you doing today?",
      translatedText: "Hola, ¿cómo estás hoy?",
      fromLanguage: 'en',
      toLanguage: 'es',
      timestamp: new Date(2025, 0, 15, 14, 30),
      category: 'casual',
    },
    {
      id: '2',
      originalText: "Where is the nearest hospital?",
      translatedText: "¿Dónde está el hospital más cercano?",
      fromLanguage: 'en',
      toLanguage: 'es',
      timestamp: new Date(2025, 0, 15, 10, 15),
      category: 'travel',
    },
    {
      id: '3',
      originalText: "Let's schedule a meeting for tomorrow.",
      translatedText: "Programemos una reunión para mañana.",
      fromLanguage: 'en',
      toLanguage: 'es',
      timestamp: new Date(2025, 0, 14, 16, 45),
      category: 'business',
    },
    {
      id: '4',
      originalText: "The quarterly report is ready for review.",
      translatedText: "El informe trimestral está listo para revisión.",
      fromLanguage: 'en',
      toLanguage: 'es',
      timestamp: new Date(2025, 0, 14, 9, 20),
      category: 'meeting',
    },
    {
      id: '5',
      originalText: "Thank you for your help!",
      translatedText: "¡Gracias por tu ayuda!",
      fromLanguage: 'en',
      toLanguage: 'es',
      timestamp: new Date(2025, 0, 13, 18, 10),
      category: 'casual',
    },
  ];

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Spanish', flag: '🇪🇸' },
    fr: { name: 'French', flag: '🇫🇷' },
    de: { name: 'German', flag: '🇩🇪' },
  };

  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'casual', name: 'Casual', icon: '💬' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'meeting', name: 'Meeting', icon: '🤝' },
  ];

  const filteredTranslations = mockTranslations.filter(translation => {
    const matchesSearch = 
      translation.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.translatedText.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || translation.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'casual': return '#10b981';
      case 'travel': return '#3b82f6';
      case 'business': return '#8b5cf6';
      case 'meeting': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const renderTranslation = ({ item }: { item: ArchivedTranslation }) => (
    <View style={styles.translationItem}>
      <View style={styles.translationHeader}>
        <View style={styles.languageInfo}>
          <Text style={styles.languageFlag}>
            {languages[item.fromLanguage as keyof typeof languages]?.flag}
          </Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={styles.languageFlag}>
            {languages[item.toLanguage as keyof typeof languages]?.flag}
          </Text>
          {item.category && (
            <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(item.category) }]}>
              <Text style={styles.categoryText}>
                {categories.find(c => c.id === item.category)?.name}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
      
      <View style={styles.translationContent}>
        <Text style={styles.originalText} numberOfLines={2}>
          {item.originalText}
        </Text>
        <Text style={styles.translatedText} numberOfLines={2}>
          {item.translatedText}
        </Text>
      </View>
      
      <View style={styles.translationActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Volume2 size={16} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share size={16} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Translation Archive</Text>
        <Text style={styles.subtitle}>{filteredTranslations.length} conversations</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search translations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(item.id)}
            >
              <Text style={styles.filterIcon}>{item.icon}</Text>
              <Text style={[
                styles.filterText,
                selectedFilter === item.id && styles.filterTextActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      <FlatList
        data={filteredTranslations}
        keyExtractor={(item) => item.id}
        renderItem={renderTranslation}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>No translations found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search terms' : 'Start translating to build your archive'}
            </Text>
          </View>
        )}
      />
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filtersList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  translationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  translationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageFlag: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 14,
    color: '#64748b',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
  },
  translationContent: {
    marginBottom: 12,
  },
  originalText: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 22,
    marginBottom: 6,
  },
  translatedText: {
    fontSize: 15,
    color: '#2563eb',
    lineHeight: 22,
    fontWeight: '500',
  },
  translationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    padding: 4,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
