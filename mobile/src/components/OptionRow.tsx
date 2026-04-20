import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from '../theme/styles';
import type { Palette } from '../types/app';
import { humanize } from '../utils/format';

type Props = {
  palette: Palette;
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
};

export function OptionRow({ palette, label, options, selected, onSelect, columns }: Props) {
  const resolvedColumns =
    columns ?? (options.length >= 4 ? 2 : options.length === 3 ? 3 : 1);
  const itemWidth =
    resolvedColumns === 1 ? '100%' : resolvedColumns === 2 ? '48%' : resolvedColumns === 3 ? '31%' : '23%';

  return (
    <View style={styles.optionRow}>
      <Text style={[styles.subheading, { color: palette.text }]}>{label}</Text>
      <View style={styles.pillGrid}>
        {options.map((option) => {
          const active = option === selected;
          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={[
                styles.togglePill,
                { width: itemWidth },
                {
                  borderColor: active ? palette.accent : palette.line,
                  backgroundColor: active ? palette.badge : palette.input,
                },
              ]}
            >
              <Text style={[styles.toggleLabel, { color: active ? palette.text : palette.muted }]}>
                {humanize(option)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
