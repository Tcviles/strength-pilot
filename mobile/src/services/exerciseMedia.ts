import { launchImageLibrary } from 'react-native-image-picker';

import { publicApiRequest } from './api';
import type { ExerciseApiRecord } from './exerciseLibrary';

type MediaSlot = 'thumbnail' | 'detail';

function inferContentType(fileName?: string, fallbackType?: string) {
  if (fallbackType?.startsWith('image/')) {
    return fallbackType;
  }

  const lower = (fileName || '').toLowerCase();
  if (lower.endsWith('.png')) {
    return 'image/png';
  }
  if (lower.endsWith('.webp')) {
    return 'image/webp';
  }
  return 'image/jpeg';
}

export async function uploadExerciseMedia(exerciseId: string, slot: MediaSlot) {
  const picker = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
    includeBase64: true,
    quality: slot === 'thumbnail' ? 0.8 : 0.9,
    maxWidth: slot === 'thumbnail' ? 640 : 1440,
    maxHeight: slot === 'thumbnail' ? 640 : 1440,
  });

  if (picker.didCancel) {
    return null;
  }

  const asset = picker.assets?.[0];
  if (!asset?.base64) {
    throw new Error('No image data was selected.');
  }

  const response = await publicApiRequest<{ exercise: ExerciseApiRecord; slot: MediaSlot; url: string }>(
    `/exercises/${exerciseId}/media`,
    'POST',
    {
      slot,
      fileName: asset.fileName || `${slot}.jpg`,
      contentType: inferContentType(asset.fileName, asset.type),
      base64Data: asset.base64,
    },
  );

  return response.exercise;
}
