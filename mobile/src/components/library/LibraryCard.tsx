import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { publicApiRequest } from '../../services/api';
import { ExerciseInfoModal, type ExerciseInfoRecord } from '../shared/ExerciseInfoModal';
import { AddExerciseModal } from './AddExerciseModal';
import { libraryCardStyles } from './LibraryCard.styles';

type ExerciseApiRecord = {
  exerciseId: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  tips: string[];
  alternatives: string[];
  attachments?: string[];
};

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
  const [fetchedExercises, setFetchedExercises] = useState<ExerciseInfoRecord[]>([]);
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

    publicApiRequest<{ exercises: ExerciseApiRecord[] }>('/exercises')
      .then((payload) => {
        if (cancelled) {
          return;
        }

        const byId = new Map(payload.exercises.map((exercise) => [exercise.exerciseId, exercise]));
        const mapped = payload.exercises
          .map((exercise) => ({
            exerciseId: exercise.exerciseId,
            name: exercise.name,
            equipment: titleize(exercise.equipment[0] || 'machine'),
            attachments: (exercise.attachments || []).map(titleize),
            primaryMuscles: exercise.primaryMuscles.map(titleize),
            secondaryMuscles: exercise.secondaryMuscles.map(titleize),
            tips: exercise.tips,
            alternatives: exercise.alternatives.map((alternativeId) => {
              const alternative = byId.get(alternativeId);
              return {
                exerciseId: alternativeId,
                name: alternative?.name || titleize(alternativeId),
                equipment: titleize(alternative?.equipment?.[0] || 'machine'),
              };
            }),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setFetchedExercises(mapped);
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

  const handleAddExercise = async (payload: { name: string; equipment: string; notes?: string }) => {
    setAddLoading(true);
    setAddError('');

    try {
      const response = await publicApiRequest<{ exercise: ExerciseApiRecord }>(
        '/exercises',
        'POST',
        payload,
      );
      const exercise = response.exercise;
      const mapped: ExerciseInfoRecord = {
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        equipment: titleize(exercise.equipment[0] || 'machine'),
        attachments: (exercise.attachments || []).map(titleize),
        primaryMuscles: exercise.primaryMuscles.map(titleize),
        secondaryMuscles: exercise.secondaryMuscles.map(titleize),
        tips: exercise.tips,
        alternatives: [],
      };

      setFetchedExercises((current) => {
        const next = [...current.filter((item) => item.exerciseId !== mapped.exerciseId), mapped];
        return next.sort((a, b) => a.name.localeCompare(b.name));
      });
      setShowAddExercise(false);
      setSelectedExerciseId(mapped.exerciseId);
      setSelectedExercise(mapped);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not add exercise.';
      setAddError(message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    setDeleteLoading(true);
    try {
      await publicApiRequest<{ message: string }>(`/exercises/${exerciseId}`, 'DELETE');
      setFetchedExercises((current) => current.filter((item) => item.exerciseId !== exerciseId));
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={libraryCardStyles.list}>
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
                          {exercise.name}
                        </Text>
                        <Text style={[libraryCardStyles.rowMeta, { color: palette.muted }]}>
                          {exercise.equipment} · {exercise.primaryMuscles.join(', ')}
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
        </ScrollView>
      </View>

      <ExerciseInfoModal
        exerciseId={selectedExerciseId}
        exercise={selectedExercise}
        visible={Boolean(selectedExerciseId)}
        showDelete={Boolean(selectedExerciseId)}
        deleteLoading={deleteLoading}
        onDelete={handleDeleteExercise}
        onClose={() => {
          setSelectedExerciseId(null);
          setSelectedExercise(null);
        }}
        onAlternativePress={(exerciseId) => {
          const nextExercise = fetchedExercises.find((exercise) => exercise.exerciseId === exerciseId);
          if (nextExercise) {
            openExercise(nextExercise);
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
