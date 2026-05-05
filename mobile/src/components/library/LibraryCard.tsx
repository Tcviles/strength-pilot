import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { publicApiRequest } from '../../services/api';
import {
  fetchExerciseLibraryFamilies,
  mapExerciseApiToVariants,
  mapVariantsToFamilies,
  type ExerciseApiRecord,
  type ExerciseLibraryFamily,
} from '../../services/exerciseLibrary';
import { uploadExerciseMedia } from '../../services/exerciseMedia';
import { ExerciseInfoModal, type ExerciseInfoRecord } from '../shared/ExerciseInfoModal';
import { AddExerciseModal } from './AddExerciseModal';

type ExerciseSection = {
  key: string;
  title: string;
  exercises: ExerciseInfoRecord[];
};

const SECTION_THUMBNAILS: Record<string, any> = {
  chest: require('../../media/WorkoutThumbnails/ChestHighlight.png'),
  back: require('../../media/WorkoutThumbnails/BackHighlight.png'),
  shoulders: require('../../media/WorkoutThumbnails/ShoulderHighlight.png'),
  arms: require('../../media/WorkoutThumbnails/ArmsHighlight.png'),
  legs: require('../../media/WorkoutThumbnails/LegsHighlight.png'),
  core: require('../../media/WorkoutThumbnails/AbHighlight.png'),
};

const MINI_LOGO = require('../../media/MiniLogo.png');
const TEXT_LOGO = require('../../media/TextLogo.png');

function titleize(value: string) {
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getBroadCategory(primaryMuscle: string) {
  const key = primaryMuscle.toLowerCase().replace(/\s+/g, '_');
  if (['lats', 'upper_back', 'lower_back', 'back'].includes(key)) {
    return 'back';
  }
  if (['front_delts', 'side_delts', 'rear_delts', 'shoulders'].includes(key)) {
    return 'shoulders';
  }
  if (['biceps', 'triceps', 'forearms'].includes(key)) {
    return 'arms';
  }
  if (['quads', 'hamstrings', 'glutes', 'calves'].includes(key)) {
    return 'legs';
  }
  if (['core', 'abs', 'obliques'].includes(key)) {
    return 'core';
  }
  return key || 'general';
}

export function LibraryCard() {
  const { palette } = useTheme();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseInfoRecord | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState<'thumbnail' | 'detail' | null>(null);
  const [fetchedExercises, setFetchedExercises] = useState<ExerciseLibraryFamily[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const groupedExercises = useMemo<ExerciseSection[]>(() => {
    const groupOrder = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'general'];
    const friendlyLabels: Record<string, string> = {
      chest: 'Chest',
      back: 'Back',
      shoulders: 'Shoulders',
      arms: 'Arms',
      legs: 'Legs',
      core: 'Core',
      general: 'General',
    };

    const buckets = new Map<string, ExerciseInfoRecord[]>();
    fetchedExercises.forEach((exercise) => {
      const rawKey = exercise.primaryMuscles[0] || 'General';
      const key = getBroadCategory(rawKey);
      const group = buckets.get(key) || [];
      group.push(exercise);
      buckets.set(key, group);
    });

    const orderedKeys = Array.from(buckets.keys()).sort((left, right) => {
      const leftIndex = groupOrder.indexOf(left);
      const rightIndex = groupOrder.indexOf(right);
      if (leftIndex === -1 && rightIndex === -1) {
        return left.localeCompare(right);
      }
      if (leftIndex === -1) {
        return 1;
      }
      if (rightIndex === -1) {
        return -1;
      }
      return leftIndex - rightIndex;
    });

    return orderedKeys.map((key) => ({
      key,
      title: friendlyLabels[key] || titleize(key),
      exercises: (buckets.get(key) || []).sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [fetchedExercises]);

  const toggleSection = (key: string) => {
    setCollapsedSections((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  useEffect(() => {
    let cancelled = false;

    fetchExerciseLibraryFamilies()
      .then((families) => {
        if (!cancelled) {
          setFetchedExercises(families);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const openExercise = (exercise: ExerciseInfoRecord) => {
    setSelectedExerciseId(exercise.exerciseId);
    setSelectedExercise(exercise);
  };

  const applyUpdatedExerciseRecord = (exercise: ExerciseApiRecord) => {
    const mapped = mapExerciseApiToVariants([exercise])[0];
    setFetchedExercises((current) => {
      const nextVariants = current.flatMap((item) => item.variants || [item]);
      const filtered = nextVariants.filter((item) => item.exerciseId !== mapped.exerciseId);
      return mapVariantsToFamilies([...filtered, mapped]);
    });
    setSelectedExerciseId(mapped.exerciseId);
    setSelectedExercise((current) => ({
      ...(current || mapped),
      ...mapped,
      name: mapped.familyName || mapped.name,
      variants: current?.variants?.map((variant) =>
        variant.exerciseId === mapped.exerciseId
          ? { ...variant, ...mapped }
          : variant,
      ) || [mapped],
    }));
  };

  const handleAddExercise = async (payload: { name: string; equipment: string; notes?: string }) => {
    setAddLoading(true);
    setAddError('');

    try {
      const response = await publicApiRequest<{ exercise: ExerciseApiRecord }>(
        '/exercises',
        'POST',
        payload,
      );
      applyUpdatedExerciseRecord(response.exercise);
      setShowAddExercise(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not add exercise.';
      setAddError(message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleUploadMedia = async (exerciseId: string, slot: 'thumbnail' | 'detail') => {
    setUploadLoading(slot);
    setAddError('');
    try {
      const updated = await uploadExerciseMedia(exerciseId, slot);
      if (updated) {
        applyUpdatedExerciseRecord(updated);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not upload image.';
      setAddError(message);
      Alert.alert('Upload failed', message);
    } finally {
      setUploadLoading(null);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    setDeleteLoading(true);
    try {
      await publicApiRequest<{ message: string }>(`/exercises/${exerciseId}`, 'DELETE');
      setFetchedExercises((current) => current.flatMap((item) => {
        const variants = item.variants?.filter((variant) => variant.exerciseId !== exerciseId);
        if (item.exerciseId === exerciseId && !item.variants?.length) {
          return [];
        }
        if (!variants?.length) {
          return item.exerciseId === exerciseId ? [] : [item];
        }

        const nextRepresentative = variants[0];
        return [{
          ...nextRepresentative,
          name: nextRepresentative.familyName || nextRepresentative.name,
          variants,
        }];
      }));
      setSelectedExerciseId(null);
      setSelectedExercise(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not delete exercise.';
      setAddError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <View style={libraryCardStyles.card}>
        <View style={libraryCardStyles.brandRow}>
          <View style={libraryCardStyles.brandLockup}>
            <Image source={MINI_LOGO} style={libraryCardStyles.brandMiniLogo} resizeMode="contain" />
            <Image source={TEXT_LOGO} style={libraryCardStyles.brandTextLogo} resizeMode="contain" />
          </View>
        </View>

        <View style={libraryCardStyles.introRow}>
          <View style={libraryCardStyles.headerCopy}>
            <Text style={[libraryCardStyles.title, { color: palette.text }]}>Exercise Library</Text>
            <Text style={[libraryCardStyles.body, { color: palette.muted }]}>
              Browse the movements in StrengthPilot
            </Text>
            <Text style={[libraryCardStyles.body, { color: palette.muted }]}>
              and tap one to open its detail card.
            </Text>
          </View>

          <View style={libraryCardStyles.addButtonWrap}>
            <Pressable
              onPress={() => {
                setAddError('');
                setShowAddExercise(true);
              }}
              style={[
                libraryCardStyles.addButton,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[libraryCardStyles.addButtonPlus, { color: palette.accent }]}>+</Text>
            </Pressable>
            <Text style={[libraryCardStyles.addButtonLabel, { color: palette.muted }]}>Add Exercise</Text>
          </View>
        </View>

        <View style={libraryCardStyles.list}>
          {groupedExercises.length ? groupedExercises.map((section) => (
            <View key={section.key} style={libraryCardStyles.section}>
              <Pressable
                onPress={() => toggleSection(section.key)}
                style={[
                  libraryCardStyles.sectionHeader,
                  { backgroundColor: palette.panel, borderColor: palette.line },
                ]}
              >
                <View style={libraryCardStyles.sectionHeaderLeft}>
                  {SECTION_THUMBNAILS[section.key] ? (
                    <Image
                      source={SECTION_THUMBNAILS[section.key]}
                      style={libraryCardStyles.sectionThumbnail}
                      resizeMode="cover"
                    />
                  ) : null}
                  <View style={libraryCardStyles.sectionCopy}>
                    <Text style={[libraryCardStyles.sectionTitle, { color: palette.text }]}>
                      {section.title}
                    </Text>
                    <Text style={[libraryCardStyles.sectionSubtitle, { color: palette.muted }]}>
                      {section.exercises.length} exercises
                    </Text>
                  </View>
                </View>
                <View style={libraryCardStyles.sectionHeaderRight}>
                  <View
                    style={[
                      libraryCardStyles.sectionCountBadge,
                      { backgroundColor: palette.card, borderColor: palette.line },
                    ]}
                  >
                    <Text style={[libraryCardStyles.sectionCount, { color: palette.accent }]}>
                      {section.exercises.length}
                    </Text>
                  </View>
                  <Text style={[libraryCardStyles.sectionChevron, { color: palette.muted }]}>
                    {collapsedSections[section.key] !== false ? '›' : '⌄'}
                  </Text>
                </View>
              </Pressable>
              {collapsedSections[section.key] !== false ? null : (
                <View style={libraryCardStyles.sectionList}>
                  {section.exercises.map((exercise) => (
                    <Pressable
                      key={exercise.exerciseId}
                      onPress={() => openExercise(exercise)}
                      style={[
                        libraryCardStyles.row,
                        { backgroundColor: palette.panel, borderColor: palette.line },
                      ]}
                    >
                      <View style={libraryCardStyles.rowCopy}>
                        <Text style={[libraryCardStyles.rowTitle, { color: palette.text }]}>
                          {exercise.familyName || exercise.name}
                        </Text>
                        <Text style={[libraryCardStyles.rowMeta, { color: palette.muted }]}>
                          {exercise.variants && exercise.variants.length > 1
                            ? `${exercise.variants.length} types`
                            : `${exercise.equipment} · ${exercise.primaryMuscles.join(', ')}`}
                        </Text>
                      </View>
                      <Text style={[libraryCardStyles.rowChevron, { color: palette.muted }]}>›</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )) : (
            <View
              style={[
                libraryCardStyles.emptyState,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[libraryCardStyles.emptyStateTitle, { color: palette.text }]}>
                No exercises in the library yet.
              </Text>
              <Text style={[libraryCardStyles.emptyStateBody, { color: palette.muted }]}>
                Seed the exercise table or add a custom exercise to get started.
              </Text>
            </View>
          )}

          <Pressable
            style={[
              libraryCardStyles.promoCard,
              { backgroundColor: palette.panel, borderColor: palette.line },
            ]}
          >
            <View style={libraryCardStyles.promoLeft}>
              <Image source={MINI_LOGO} style={libraryCardStyles.promoLogo} resizeMode="contain" />
              <View style={libraryCardStyles.promoCopy}>
                <Text style={[libraryCardStyles.promoTitle, { color: palette.text }]}>
                  Build stronger. Every day.
                </Text>
                <Text style={[libraryCardStyles.promoBody, { color: palette.muted }]}>
                  Find the right movement. Train smarter.
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      <ExerciseInfoModal
        exerciseId={selectedExerciseId}
        exercise={selectedExercise}
        visible={Boolean(selectedExerciseId)}
        showDelete={Boolean(selectedExerciseId)}
        deleteLoading={deleteLoading}
        uploadLoading={uploadLoading}
        onDelete={handleDeleteExercise}
        onUploadThumbnail={(exerciseId) => handleUploadMedia(exerciseId, 'thumbnail')}
        onUploadDetail={(exerciseId) => handleUploadMedia(exerciseId, 'detail')}
        onClose={() => {
          setSelectedExerciseId(null);
          setSelectedExercise(null);
        }}
        onAlternativePress={(exerciseId) => {
          const nextExercise = fetchedExercises.find((exercise) => (
            exercise.exerciseId === exerciseId || exercise.variants?.some((variant) => variant.exerciseId === exerciseId)
          ));
          if (nextExercise) {
            const exactVariant = nextExercise.variants?.find((variant) => variant.exerciseId === exerciseId);
            openExercise(exactVariant ? { ...nextExercise, ...exactVariant, variants: nextExercise.variants } : nextExercise);
          }
        }}
      />

      <AddExerciseModal
        visible={showAddExercise}
        loading={addLoading}
        error={addError}
        onClose={() => setShowAddExercise(false)}
        onSubmit={handleAddExercise}
      />
    </>
  );
}

const libraryCardStyles = StyleSheet.create({
  card: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 0,
    gap: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMiniLogo: {
    width: 42,
    height: 42,
  },
  brandTextLogo: {
    width: 178,
    height: 24,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },
  addButtonWrap: {
    alignItems: 'center',
    gap: 6,
    width: 68,
    paddingTop: 2,
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPlus: {
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '300',
    marginTop: -3,
  },
  addButtonLabel: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 10,
    maxWidth: '82%',
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  body: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '400',
  },
  list: {
    gap: 10,
    paddingBottom: 6,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  sectionThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  sectionCopy: {
    gap: 2,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.4,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionCountBadge: {
    minWidth: 44,
    height: 44,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionChevron: {
    fontSize: 22,
    fontWeight: '700',
  },
  sectionList: {
    gap: 8,
    paddingHorizontal: 6,
  },
  row: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  rowMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  rowChevron: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  emptyStateBody: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  promoCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 2,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  promoLogo: {
    width: 48,
    height: 48,
  },
  promoCopy: {
    gap: 4,
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  promoBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
