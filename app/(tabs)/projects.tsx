import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  Plus, 
  Search, 
  Filter, 
  X,
  BarChart
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useProjectsStore } from '@/store/projectsStore';
import { Project } from '@/types';

export default function ProjectsScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { projects, fetchProjects, filterProjects } = useProjectsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Project['status'] | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    router.push('/projects/create');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus(undefined);
  };

  const filteredProjects = filterProjects(selectedStatus, searchQuery);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Проекты
        </Text>
        <Button
          title="Создать"
          onPress={handleCreateProject}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
          size="small"
        />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={20} color={colors.secondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Поиск проектов..."
            placeholderTextColor={colors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={colors.secondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: showFilters ? colors.primaryLight : colors.card }
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? colors.primary : colors.secondary} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={[styles.filtersTitle, { color: colors.text }]}>
            Статус проекта:
          </Text>
          <View style={styles.statusFilters}>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === undefined && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
              onPress={() => setSelectedStatus(undefined)}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === undefined && { color: colors.primary },
                ]}
              >
                Все
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === 'planning' && { backgroundColor: colors.infoLight, borderColor: colors.info },
              ]}
              onPress={() => setSelectedStatus('planning')}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === 'planning' && { color: colors.info },
                ]}
              >
                Планирование
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === 'in_progress' && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
              onPress={() => setSelectedStatus('in_progress')}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === 'in_progress' && { color: colors.primary },
                ]}
              >
                В работе
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === 'on_hold' && { backgroundColor: colors.warningLight, borderColor: colors.warning },
              ]}
              onPress={() => setSelectedStatus('on_hold')}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === 'on_hold' && { color: colors.warning },
                ]}
              >
                На паузе
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === 'completed' && { backgroundColor: colors.successLight, borderColor: colors.success },
              ]}
              onPress={() => setSelectedStatus('completed')}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === 'completed' && { color: colors.success },
                ]}
              >
                Завершен
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === 'archived' && { backgroundColor: colors.secondaryLight, borderColor: colors.secondary },
              ]}
              onPress={() => setSelectedStatus('archived')}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === 'archived' && { color: colors.secondary },
                ]}
              >
                В архиве
              </Text>
            </TouchableOpacity>
          </View>
          {(searchQuery || selectedStatus) && (
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}
            >
              <Text style={[styles.clearFiltersText, { color: colors.primary }]}>
                Сбросить фильтры
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.projectsList}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <EmptyState
            icon={<BarChart size={48} color={colors.secondary} />}
            title="Проекты не найдены"
            description={
              searchQuery || selectedStatus
                ? "Попробуйте изменить параметры поиска или фильтры"
                : "У вас пока нет проектов. Создайте свой первый проект!"
            }
            actionButton={
              !searchQuery && !selectedStatus ? (
                <Button
                  title="Создать проект"
                  onPress={handleCreateProject}
                  leftIcon={<Plus size={20} color="#FFFFFF" />}
                />
              ) : (
                <Button
                  title="Сбросить фильтры"
                  onPress={handleClearFilters}
                  variant="outline"
                />
              )
            }
          />
        )}
      </ScrollView>

      <View style={styles.fabContainer}>
        <Button
          title="Новый проект"
          onPress={handleCreateProject}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
          style={styles.fab}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusFilter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  statusFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
  },
  projectsList: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    borderRadius: 28,
    paddingHorizontal: 20,
  },
});